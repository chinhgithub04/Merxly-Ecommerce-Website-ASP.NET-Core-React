import { HeartIcon } from '@heroicons/react/24/solid';

export const HomeFooter = () => {
  return (
    <footer className='bg-neutral-900 text-neutral-300'>
      {/* Main Footer Content */}
      <div className='px-4 md:px-8 lg:px-20 py-8 md:py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8'>
          {/* Brand Section */}
          <div className='md:col-span-3 lg:col-span-2'>
            <h2 className='text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4'>
              Merxly
            </h2>
            <p className='text-sm mb-4 text-neutral-400'>
              Your trusted marketplace for quality products. Shop with
              confidence and discover amazing deals every day.
            </p>
            <div className='flex gap-4'>
              {/* Social Media Icons (placeholders) */}
              <a
                href='#'
                className='w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-primary-600 rounded-lg transition-colors cursor-pointer'
                aria-label='Facebook'
              >
                <span className='text-white text-sm font-bold'>f</span>
              </a>
              <a
                href='#'
                className='w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-primary-600 rounded-lg transition-colors cursor-pointer'
                aria-label='Twitter'
              >
                <span className='text-white text-sm font-bold'>X</span>
              </a>
              <a
                href='#'
                className='w-10 h-10 flex items-center justify-center bg-neutral-800 hover:bg-primary-600 rounded-lg transition-colors cursor-pointer'
                aria-label='Instagram'
              >
                <span className='text-white text-sm font-bold'>IG</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-semibold text-base mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className='text-white font-semibold text-base mb-4'>
              Customer Service
            </h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className='text-white font-semibold text-base mb-4'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-sm hover:text-primary-500 transition-colors cursor-pointer'
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-neutral-800 px-4 md:px-8 lg:px-20 py-4 md:py-6'>
        <div className='flex flex-col md:flex-row items-center justify-between text-xs md:text-sm gap-2 md:gap-0'>
          <p className='text-neutral-500'>
            © {new Date().getFullYear()} Merxly. All rights reserved.
          </p>
          <p className='flex items-center gap-1 text-neutral-500'>
            Made with <HeartIcon className='h-4 w-4 text-error-500 inline' />{' '}
            for amazing shoppers
          </p>
        </div>
      </div>
    </footer>
  );
};
