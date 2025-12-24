import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

type OrderStatus =
  | 'All'
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

interface OrderFiltersProps {
  selectedStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const statuses: OrderStatus[] = [
  'All',
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const OrderFilters = ({
  selectedStatus,
  onStatusChange,
  searchTerm,
  onSearchChange,
}: OrderFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className='bg-white rounded-lg border border-neutral-200 p-4 space-y-4'>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Search */}
        <div className='flex-1 relative'>
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400' />
          <input
            type='text'
            placeholder='Search by order number or customer name...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2'
        >
          <FunnelIcon className='h-5 w-5 text-neutral-600' />
          <span className='text-sm font-medium text-neutral-700'>Filters</span>
        </button>
      </div>

      {/* Status Filters */}
      {showFilters && (
        <div className='pt-4 border-t border-neutral-200'>
          <p className='text-sm font-medium text-neutral-700 mb-3'>
            Order Status
          </p>
          <div className='flex flex-wrap gap-2'>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
