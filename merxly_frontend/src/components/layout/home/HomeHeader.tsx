import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole } from '../../../types/enums';
import { getProductImageUrlCustom } from '../../../utils/cloudinaryHelpers';

export const HomeHeader = () => {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const isCustomer = user?.roles.includes(UserRole.Customer);

  return (
    <header className='fixed top-0 left-0 right-0 h-20 bg-white border-b border-neutral-200 z-30'>
      <div className='flex items-center justify-between h-full px-20'>
        {/* Logo */}
        <div className='flex items-center'>
          <Link to='/' className='text-3xl font-bold text-primary-600'>
            Merxly
          </Link>
        </div>

        {/* Search Bar */}
        <div className='flex-1 max-w-3xl mx-12'>
          <form onSubmit={handleSearch} className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
              <MagnifyingGlassIcon className='h-6 w-6 text-neutral-400' />
            </div>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search products...'
              className='w-full pl-12 pr-6 py-2 border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors'
            />
          </form>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3'>
          {/* Selling on Merxly */}
          <Link
            to='/sign-up-new-store'
            className='px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors'
          >
            Selling on Merxly
          </Link>

          {/* Cart */}
          <Link
            to='/cart'
            className='relative p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer'
          >
            <ShoppingCartIcon className='h-7 w-7' />
            {/* Cart Badge */}
            {cart && cart.totalItems > 0 && (
              <span className='absolute top-1 right-1 min-w-5 h-5 flex items-center justify-center bg-primary-600 text-white text-xs font-semibold rounded-full px-1.5'>
                {cart.totalItems > 99 ? '99+' : cart.totalItems}
              </span>
            )}
          </Link>

          {/* Favorites */}
          <button className='relative p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer'>
            <HeartIcon className='h-7 w-7' />
          </button>

          {/* User Account */}
          {!isAuthenticated ? (
            <Link
              to='/login'
              className='px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors'
            >
              Login
            </Link>
          ) : isCustomer ? (
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer'
              >
                {user?.avatarPublicId ? (
                  <img
                    src={getProductImageUrlCustom(user.avatarPublicId, 40, 40)}
                    alt={`${user.firstName} ${user.lastName}`}
                    className='w-10 h-10 rounded-full object-cover'
                  />
                ) : (
                  <UserCircleIcon className='h-10 w-10 text-neutral-600' />
                )}
                <ChevronDownIcon className='h-4 w-4 text-neutral-600' />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50'>
                  {/* User Info */}
                  <div className='px-4 py-3 border-b border-neutral-200'>
                    <div className='flex items-center gap-3'>
                      {user?.avatarPublicId ? (
                        <img
                          src={getProductImageUrlCustom(
                            user.avatarPublicId,
                            48,
                            48
                          )}
                          alt={`${user.firstName} ${user.lastName}`}
                          className='w-12 h-12 rounded-full object-cover'
                        />
                      ) : (
                        <UserCircleIcon className='h-12 w-12 text-neutral-400' />
                      )}
                      <div>
                        <p className='text-sm font-semibold text-neutral-900'>
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className='text-xs text-neutral-500'>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className='py-1'>
                    <Link
                      to='/user-account/dashboard'
                      onClick={() => setIsDropdownOpen(false)}
                      className='flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors'
                    >
                      <UserIcon className='h-5 w-5 text-neutral-500' />
                      <span>Your profile</span>
                    </Link>

                    <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer text-left'>
                      <Cog6ToothIcon className='h-5 w-5 text-neutral-500' />
                      <span>Settings</span>
                    </button>

                    <button className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer text-left'>
                      <QuestionMarkCircleIcon className='h-5 w-5 text-neutral-500' />
                      <span>Help & Support</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className='border-t border-neutral-200 py-1'>
                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left'
                    >
                      <ArrowRightStartOnRectangleIcon className='h-5 w-5' />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
