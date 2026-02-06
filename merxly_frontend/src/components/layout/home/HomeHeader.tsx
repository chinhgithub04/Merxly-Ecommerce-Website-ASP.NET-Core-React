import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ArrowRightStartOnRectangleIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole } from '../../../types/enums';
import { getCategoryTree } from '../../../services/categoryService';
import type { CategoryDto } from '../../../types/models/category';
import { getProductImageUrlCustom } from '../../../utils/cloudinaryHelpers';

export const HomeHeader = () => {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null,
  );
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsCategoryDropdownOpen(false);
    navigate(`/search?categoryId=${categoryId}`);
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

  // Focus search input when mobile search opens
  useEffect(() => {
    if (showMobileSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMobileSearch]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories-tree'],
    queryFn: () => getCategoryTree(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData?.data?.items || [];
  const rootCategories = categories.filter((cat) => !cat.parentCategoryId);

  const renderCategoryItem = (category: CategoryDto, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isHovered = hoveredCategoryId === category.id;

    return (
      <div
        key={category.id}
        className='relative'
        onMouseEnter={() => setHoveredCategoryId(category.id)}
        onMouseLeave={() => setHoveredCategoryId(null)}
      >
        <button
          onClick={() => handleCategoryClick(category.id)}
          className='w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer text-left'
        >
          <span>{category.name}</span>
          {hasChildren && (
            <ChevronRightIcon className='h-4 w-4 text-neutral-400' />
          )}
        </button>

        {/* Submenu */}
        {hasChildren && isHovered && (
          <div className='absolute left-full top-0 ml-1 min-w-[200px] bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50'>
            {category.children.map((child) =>
              renderCategoryItem(child, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  const isCustomer = user?.roles.includes(UserRole.Customer);

  return (
    <>
      <header className='fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-30'>
        <div className='flex items-center justify-between h-16 md:h-20 px-4 md:px-8 lg:px-20'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              to='/'
              className='text-xl md:text-2xl lg:text-3xl font-bold text-primary-600'
            >
              Merxly
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className='hidden md:flex flex-1 max-w-3xl mx-2 md:mx-6 lg:mx-12'>
            <form onSubmit={handleSearch} className='relative w-full'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 pointer-events-none'>
                <MagnifyingGlassIcon className='h-5 w-5 md:h-6 md:w-6 text-neutral-400' />
              </div>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search products...'
                className='w-full pl-10 md:pl-12 pr-4 md:pr-6 py-1.5 md:py-2 border border-neutral-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors'
              />
            </form>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-1 md:gap-2 lg:gap-3'>
            {/* Mobile Search Icon */}
            <button
              onClick={handleMobileSearchToggle}
              className='md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors'
            >
              <MagnifyingGlassIcon className='h-6 w-6' />
            </button>

            {/* Selling on Merxly - Always show on desktop, hide on mobile for unauthenticated */}
            <Link
              to='/sign-up-new-store'
              className={`${
                isAuthenticated ? 'hidden lg:block' : 'hidden lg:block'
              } px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors`}
            >
              Selling on Merxly
            </Link>

            {/* Cart - Always show on desktop, hide on mobile for unauthenticated */}
            <Link
              to='/cart'
              className={`${
                isAuthenticated ? 'hidden md:flex' : 'hidden md:flex'
              } relative p-2 md:p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer`}
            >
              <ShoppingCartIcon className='h-6 w-6 md:h-7 md:w-7' />
              {cart && cart.totalItems > 0 && (
                <span className='absolute top-0.5 md:top-1 right-0.5 md:right-1 min-w-4 md:min-w-5 h-4 md:h-5 flex items-center justify-center bg-primary-600 text-white text-[10px] md:text-xs font-semibold rounded-full px-1 md:px-1.5'>
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </Link>

            {/* Wishlist - Always show on desktop, hide on mobile for unauthenticated */}
            <Link
              to='/wishlist'
              className={`${
                isAuthenticated ? 'hidden md:flex' : 'hidden md:flex'
              } relative p-2 md:p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer`}
            >
              <HeartIcon className='h-6 w-6 md:h-7 md:w-7' />
            </Link>

            {/* User Account */}
            {!isAuthenticated ? (
              <Link
                to='/login'
                className='px-3 md:px-6 py-1.5 md:py-2 bg-primary-600 text-white rounded-lg text-sm md:text-base font-medium hover:bg-primary-700 transition-colors'
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
                      src={getProductImageUrlCustom(
                        user.avatarPublicId,
                        40,
                        40,
                      )}
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
                              48,
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

                      <Link
                        to='/sign-up-new-store'
                        onClick={() => setIsDropdownOpen(false)}
                        className='flex md:hidden items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors'
                      >
                        <BuildingStorefrontIcon className='h-5 w-5 text-neutral-500' />
                        <span>Selling on Merxly</span>
                      </Link>

                      <Link
                        to='/cart'
                        onClick={() => setIsDropdownOpen(false)}
                        className='flex md:hidden items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors'
                      >
                        <ShoppingCartIcon className='h-5 w-5 text-neutral-500' />
                        <div className='flex items-center gap-2'>
                          <span>Cart</span>
                          {cart && cart.totalItems > 0 && (
                            <span className='min-w-5 h-5 flex items-center justify-center bg-primary-600 text-white text-xs font-semibold rounded-full px-1.5'>
                              {cart.totalItems > 99 ? '99+' : cart.totalItems}
                            </span>
                          )}
                        </div>
                      </Link>

                      <Link
                        to='/wishlist'
                        onClick={() => setIsDropdownOpen(false)}
                        className='flex md:hidden items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors'
                      >
                        <HeartIcon className='h-5 w-5 text-neutral-500' />
                        <span>Wishlist</span>
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

        <div className='border-t border-neutral-200 bg-white hidden md:block'>
          <div className='flex items-center gap-6 px-4 md:px-8 lg:px-20 py-3'>
            {/* Category Dropdown */}
            <div className='relative'>
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer'
              >
                <span>All category</span>
                {isCategoryDropdownOpen ? (
                  <ChevronUpIcon className='h-4 w-4' />
                ) : (
                  <ChevronDownIcon className='h-4 w-4' />
                )}
              </button>

              {/* Dropdown Menu */}
              {isCategoryDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className='fixed inset-0 z-10'
                    onClick={() => setIsCategoryDropdownOpen(false)}
                  />

                  {/* Dropdown content */}
                  <div className='absolute top-full left-0 mt-1 min-w-[250px] bg-white border border-neutral-200 rounded-lg shadow-lg z-20'>
                    {rootCategories.map((category) =>
                      renderCategoryItem(category),
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
              <TruckIcon className='h-5 w-5' />
              <span>Track Order</span>
            </button>

            <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
              <ScaleIcon className='h-5 w-5' />
              <span>Compare</span>
            </button>

            <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
              <ChatBubbleLeftRightIcon className='h-5 w-5' />
              <span>Customer Support</span>
            </button>

            <button className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors cursor-pointer'>
              <QuestionMarkCircleIcon className='h-5 w-5' />
              <span>Need help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className='fixed top-16 left-0 right-0 bg-white border-b border-neutral-200 z-20 md:hidden'>
          <div className='p-4'>
            <form onSubmit={handleSearch} className='relative w-full'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
                <MagnifyingGlassIcon className='h-6 w-6 text-neutral-400' />
              </div>
              <input
                ref={searchRef}
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search products...'
                className='w-full pl-12 pr-4 py-2.5 border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors'
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};
