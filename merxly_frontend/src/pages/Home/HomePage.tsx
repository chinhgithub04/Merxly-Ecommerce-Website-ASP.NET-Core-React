import { HomeHeader, HomeActionBar } from '../../components/layout/home';
import { ShopWithCategories } from '../../components/home';

export const HomePage = () => {
  return (
    <div className='min-h-screen bg-neutral-50'>
      <HomeHeader />
      <HomeActionBar />
      {/* Main content area - empty for now */}
      <main className='pt-[136px]'>
        {/* 80px header + 56px action bar */}
        <ShopWithCategories />
      </main>
    </div>
  );
};
