import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreRegistrationForm } from '../components/store/registration/StoreRegistrationForm';
import { createStore } from '../services/storeService';
import type { CreateStoreDto } from '../types/models/store';

export const SignUpNewStorePage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateStoreDto) => {
    try {
      setError(null);

      const response = await createStore(data);

      if (response.isSuccess) {
        setIsSubmitted(true);
      } else {
        setError(response.message || 'Failed to submit store registration');
      }
    } catch (err: any) {
      console.error('Store registration error:', err);
      setError(
        err.response?.data?.message ||
          'An error occurred while submitting your registration. Please try again.',
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-neutral-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 md:p-8 text-center'>
          <div className='mx-auto w-12 md:w-16 h-12 md:h-16 bg-success-100 rounded-full flex items-center justify-center mb-3 md:mb-4'>
            <CheckCircleIcon className='h-8 md:h-10 w-8 md:w-10 text-success-600' />
          </div>
          <h2 className='text-lg md:text-2xl font-bold text-neutral-900 mb-2'>
            Registration Submitted!
          </h2>
          <p className='text-xs md:text-sm text-neutral-600 mb-4 md:mb-6'>
            Thank you for registering your store. Our team will review your
            application and contact you within 2-3 business days.
          </p>
          <div className='space-y-3'>
            <button
              onClick={() => navigate('/')}
              className='cursor-pointer w-full py-1.5 md:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-50'>
      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12'>
        {/* Hero Section */}
        <div className='text-center mb-8 md:mb-12'>
          <div className='inline-flex items-center justify-center w-12 md:w-16 h-12 md:h-16 bg-primary-100 rounded-full mb-3 md:mb-4'>
            <BuildingStorefrontIcon className='h-6 md:h-8 w-6 md:w-8 text-primary-600' />
          </div>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2 md:mb-3'>
            Start Selling on Merxly
          </h1>
          <p className='text-sm md:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto'>
            Join thousands of sellers and reach millions of customers. Create
            your store in minutes and start growing your business today.
          </p>
        </div>

        {/* Benefits */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12'>
          <div className='bg-white rounded-lg border border-neutral-200 p-4 md:p-6'>
            <div className='w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4'>
              <svg
                className='h-5 md:h-6 w-5 md:w-6 text-primary-600'
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
            <h3 className='text-base md:text-lg font-semibold text-neutral-900 mb-2'>
              Quick Setup
            </h3>
            <p className='text-xs md:text-sm text-neutral-600'>
              Get your store up and running in just a few minutes with our
              simple setup process.
            </p>
          </div>

          <div className='bg-white rounded-lg border border-neutral-200 p-4 md:p-6'>
            <div className='w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4'>
              <svg
                className='h-5 md:h-6 w-5 md:w-6 text-primary-600'
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
            <h3 className='text-base md:text-lg font-semibold text-neutral-900 mb-2'>
              Secure Payments
            </h3>
            <p className='text-xs md:text-sm text-neutral-600'>
              Receive payments securely through Stripe with automatic payouts to
              your bank account.
            </p>
          </div>

          <div className='bg-white rounded-lg border border-neutral-200 p-4 md:p-6'>
            <div className='w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4'>
              <svg
                className='h-5 md:h-6 w-5 md:w-6 text-primary-600'
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
            <h3 className='text-base md:text-lg font-semibold text-neutral-900 mb-2'>
              Grow Your Business
            </h3>
            <p className='text-xs md:text-sm text-neutral-600'>
              Access powerful analytics and tools to help you understand and
              grow your customer base.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className='bg-white rounded-lg shadow-lg border border-neutral-200 p-4 md:p-8'>
          {error && (
            <div className='mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-xs md:text-sm text-red-800'>{error}</p>
            </div>
          )}
          <StoreRegistrationForm onSubmit={handleSubmit} />
        </div>

        {/* Footer Info */}
        <div className='mt-6 md:mt-8 text-center'>
          <p className='text-xs md:text-sm text-neutral-600'>
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
