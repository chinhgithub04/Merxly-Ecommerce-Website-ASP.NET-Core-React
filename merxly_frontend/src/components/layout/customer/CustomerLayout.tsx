import { Outlet } from 'react-router-dom';
import { HomeHeader, HomeFooter } from '../home';

export const CustomerLayout = () => {
  return (
    <div className='min-h-screen bg-neutral-50'>
      <HomeHeader />

      <main className='pt-16 md:pt-32'>
        <Outlet />
      </main>

      <HomeFooter />
    </div>
  );
};
