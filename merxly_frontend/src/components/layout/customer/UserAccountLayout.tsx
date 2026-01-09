import { Outlet } from 'react-router-dom';
import { UserAccountSidebar } from './UserAccountSidebar';

export const UserAccountLayout = () => {
  return (
    <div className='flex min-h-screen'>
      <UserAccountSidebar />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
};
