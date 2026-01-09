import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';

export const HomeHeader = () => {
  const { cart } = useCart();

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
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
              <MagnifyingGlassIcon className='h-6 w-6 text-neutral-400' />
            </div>
            <input
              type='text'
              placeholder='Search products...'
              className='w-full pl-12 pr-6 py-2 border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors'
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-3'>
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
          <button className='relative p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer'>
            <UserCircleIcon className='h-7 w-7' />
          </button>
        </div>
      </div>
    </header>
  );
};
