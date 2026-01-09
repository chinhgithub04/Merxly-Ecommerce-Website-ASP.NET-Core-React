import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  CreditCardIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', path: '/user-account/dashboard', icon: Squares2X2Icon },
  {
    name: 'Order History',
    path: '/user-account/order-history',
    icon: ClipboardDocumentListIcon,
  },
  { name: 'Addresses', path: '/user-account/addresses', icon: MapPinIcon },
  {
    name: 'Payment Methods',
    path: '/user-account/payment-methods',
    icon: CreditCardIcon,
  },
  {
    name: 'Your Profile',
    path: '/user-account/profile',
    icon: UserCircleIcon,
  },
];

export const UserAccountSidebar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className='w-64 bg-white border border-neutral-200'>
      <div className='sticky top-[136px] flex flex-col'>
        {/* Navigation Menu */}
        <nav className='px-4 py-6 space-y-1'>
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/user-account/dashboard'}
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
          {/* Logout Button */}

          <button
            onClick={handleLogout}
            className='flex items-center w-full px-4 py-3 text-sm font-medium text-error-600 hover:bg-neutral-100 hover:text-error-700 rounded-lg transition-colors cursor-pointer'
          >
            <ArrowRightStartOnRectangleIcon className='h-5 w-5 mr-3' />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};
