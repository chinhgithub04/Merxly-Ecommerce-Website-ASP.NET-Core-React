import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { UserAccountSidebar } from './UserAccountSidebar';

export const UserAccountLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-[calc(100vh-7rem)] md:min-h-[calc(100vh-8rem)]'>
      <UserAccountSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className='fixed -left-2 top-1/2 -translate-y-1/2 z-30 md:hidden w-8 h-8 bg-gray-400 text-gray-100 rounded-r-4xl hover:bg-gray-500 transition-colors flex items-center justify-center'
      >
        <ChevronRightIcon className='h-4 w-4' />
      </button>

      <main className='flex-1 w-full md:w-auto'>
        <Outlet />
      </main>
    </div>
  );
};
