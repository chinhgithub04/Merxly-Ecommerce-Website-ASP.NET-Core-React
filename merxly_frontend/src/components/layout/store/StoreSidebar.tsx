import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  MapPinIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  // Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  { name: 'Home', path: '/store', icon: HomeIcon },
  { name: 'Orders', path: '/store/orders', icon: ShoppingBagIcon },
  { name: 'Products', path: '/store/products', icon: CubeIcon },
  { name: 'Locations', path: '/store/locations', icon: MapPinIcon },
  { name: 'Payments', path: '/store/payments', icon: BanknotesIcon },
  { name: 'My Store', path: '/store/my-store', icon: BuildingStorefrontIcon },
  // { name: 'Settings', path: '/store/settings', icon: Cog6ToothIcon },
];

export const StoreSidebar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className='fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-neutral-200 z-20'>
      <div className='flex flex-col h-full'>
        {/* Navigation Menu */}
        <nav className='flex-1 px-4 py-6 space-y-1'>
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/store'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                }`
              }
            >
              <item.icon className='h-5 w-5 mr-3' />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className='p-4 border-t border-neutral-200'>
          <button
            onClick={handleLogout}
            className='flex items-center w-full px-4 py-3 text-sm font-medium text-error-600 hover:bg-neutral-100 hover:text-error-700 rounded-lg transition-colors cursor-pointer'
          >
            <ArrowRightStartOnRectangleIcon className='h-5 w-5 mr-3' />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
