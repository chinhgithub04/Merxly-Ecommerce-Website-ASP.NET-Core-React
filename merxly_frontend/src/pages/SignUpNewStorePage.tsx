import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreRegistrationForm } from '../components/store/registration/StoreRegistrationForm';

export const SignUpNewStorePage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    console.log('Store registration data:', data);
    // In real implementation, this would call the API
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-neutral-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center'>
          <div className='mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4'>
            <CheckCircleIcon className='h-10 w-10 text-success-600' />
          </div>
          <h2 className='text-2xl font-bold text-neutral-900 mb-2'>
            Registration Submitted!
          </h2>
          <p className='text-neutral-600 mb-6'>
            Thank you for registering your store. Our team will review your
            application and contact you within 2-3 business days.
          </p>
          <div className='space-y-3'>
            <button
              onClick={() => navigate('/')}
              className='w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
            >
              Go to Home
            </button>
            <Link
              to='/login'
              className='block w-full px-4 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors font-medium'
            >
              Login to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-50'>
      {/* Header */}
      <header className='bg-white border-b border-neutral-200'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>M</span>
            </div>
            <span className='text-xl font-bold text-neutral-900'>Merxly</span>
          </Link>
          <div className='flex items-center gap-4'>
            <Link
              to='/login'
              className='text-sm text-neutral-600 hover:text-neutral-900'
            >
              Already have an account?
            </Link>
            <Link
              to='/login'
              className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium'
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4'>
            <BuildingStorefrontIcon className='h-8 w-8 text-primary-600' />
          </div>
          <h1 className='text-4xl font-bold text-neutral-900 mb-3'>
            Start Selling on Merxly
          </h1>
          <p className='text-lg text-neutral-600 max-w-2xl mx-auto'>
            Join thousands of sellers and reach millions of customers. Create
            your store in minutes and start growing your business today.
          </p>
        </div>

        {/* Benefits */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white rounded-lg border border-neutral-200 p-6'>
            <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4'>
              <svg
                className='h-6 w-6 text-primary-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-neutral-900 mb-2'>
              Quick Setup
            </h3>
            <p className='text-sm text-neutral-600'>
              Get your store up and running in just a few minutes with our
              simple setup process.
            </p>
          </div>

          <div className='bg-white rounded-lg border border-neutral-200 p-6'>
            <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4'>
              <svg
                className='h-6 w-6 text-primary-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-neutral-900 mb-2'>
              Secure Payments
            </h3>
            <p className='text-sm text-neutral-600'>
              Receive payments securely through Stripe with automatic payouts to
              your bank account.
            </p>
          </div>

          <div className='bg-white rounded-lg border border-neutral-200 p-6'>
            <div className='w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4'>
              <svg
                className='h-6 w-6 text-primary-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-neutral-900 mb-2'>
              Grow Your Business
            </h3>
            <p className='text-sm text-neutral-600'>
              Access powerful analytics and tools to help you understand and
              grow your customer base.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className='bg-white rounded-lg shadow-lg border border-neutral-200 p-8'>
          <StoreRegistrationForm onSubmit={handleSubmit} />
        </div>

        {/* Footer Info */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-neutral-600'>
            By registering, you agree to our{' '}
            <a href='#' className='text-primary-600 hover:text-primary-700'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='text-primary-600 hover:text-primary-700'>
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};
