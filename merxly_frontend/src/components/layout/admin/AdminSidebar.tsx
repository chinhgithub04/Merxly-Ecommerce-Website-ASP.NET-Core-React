import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  RectangleGroupIcon,
  StarIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  TrophyIcon,
  DocumentChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

interface SubNavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavItem {
  name: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SubNavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: HomeIcon,
  },
  {
    name: 'Website',
    icon: RectangleGroupIcon,
    subItems: [
      {
        name: 'Categories',
        path: '/admin/categories',
        icon: RectangleGroupIcon,
      },
      {
        name: 'Featured Products',
        path: '/admin/featured-products',
        icon: StarIcon,
      },
      {
        name: 'Analytics',
        path: '/admin/analytics',
        icon: ChartBarIcon,
      },
    ],
  },
  {
    name: 'Stores',
    icon: BuildingStorefrontIcon,
    subItems: [
      {
        name: 'All Stores',
        path: '/admin/stores/all',
        icon: BuildingStorefrontIcon,
      },
      {
        name: 'Verification',
        path: '/admin/stores/verification',
        icon: CheckBadgeIcon,
      },
      {
        name: 'Performance',
        path: '/admin/stores/performance',
        icon: TrophyIcon,
      },
      {
        name: 'Reports',
        path: '/admin/stores/reports',
        icon: DocumentChartBarIcon,
      },
    ],
  },
  {
    name: 'Users',
    icon: UsersIcon,
    subItems: [
      {
        name: 'All Users',
        path: '/admin/users',
        icon: UsersIcon,
      },
      {
        name: 'Roles & Permissions',
        path: '/admin/users/roles',
        icon: ShieldCheckIcon,
      },
      {
        name: 'User Status',
        path: '/admin/users/status',
        icon: UserCircleIcon,
      },
    ],
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: Cog6ToothIcon,
  },
];

export const AdminSidebar = () => {
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
  };

  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <aside className='fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-neutral-200 z-20 overflow-y-auto'>
      <div className='flex flex-col h-full'>
        {/* Navigation Menu */}
        <nav className='flex-1 px-4 py-6 space-y-1'>
          {navigationItems.map((item) => {
            const isExpanded = expandedItems.includes(item.name);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.name}>
                {hasSubItems ? (
                  <>
                    {/* Parent Item with SubItems */}
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className='cursor-pointer flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                    >
                      <div className='flex items-center'>
                        <item.icon className='h-5 w-5 mr-3' />
                        {item.name}
                      </div>
                      {isExpanded ? (
                        <ChevronUpIcon className='h-4 w-4' />
                      ) : (
                        <ChevronDownIcon className='h-4 w-4' />
                      )}
                    </button>

                    {/* SubItems */}
                    {isExpanded && item.subItems && (
                      <div className='ml-4 mt-1 space-y-1'>
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                              }`
                            }
                          >
                            <subItem.icon className='h-4 w-4 mr-3' />
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Single Item without SubItems */
                  <NavLink
                    to={item.path!}
                    end={item.path === '/admin'}
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
                )}
              </div>
            );
          })}
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
