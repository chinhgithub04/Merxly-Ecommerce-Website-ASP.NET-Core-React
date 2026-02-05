import { Outlet } from 'react-router-dom';
import { HomeHeader, HomeActionBar, HomeFooter } from '../home';

export const CustomerLayout = () => {
  return (
    <div className='min-h-screen bg-neutral-50'>
      <HomeHeader />
      <div className='hidden lg:block'>
        <HomeActionBar />
      </div>

      <main className='pt-16 md:pt-20 lg:pt-[136px]'>
        <Outlet />
      </main>

      <HomeFooter />
    </div>
  );
};
