import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

type OrderStatusFilter =
  | 'All'
  | 'Confirmed'
  | 'Processing'
  | 'Delivering'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

interface OrderFiltersProps {
  selectedStatus: OrderStatusFilter;
  onStatusChange: (status: OrderStatusFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  fromDate?: string;
  onFromDateChange?: (date: string) => void;
  toDate?: string;
  onToDateChange?: (date: string) => void;
}

const statuses: { value: OrderStatusFilter; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Confirmed', label: 'Pending' }, // Display as "Pending" to indicate new orders
  { value: 'Processing', label: 'Processing' },
  { value: 'Delivering', label: 'Delivering' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const today = new Date().toISOString().split('T')[0];

export const OrderFilters = ({
  selectedStatus,
  onStatusChange,
  searchTerm,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: OrderFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className='bg-white border border-neutral-200 p-3 md:p-4 space-y-3 md:space-y-4 rounded-b-lg md:rounded-b-none'>
      <div className='flex flex-col md:flex-row gap-3 md:gap-4'>
        {/* Search */}
        <div className='flex-1 relative'>
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-neutral-400' />
          <input
            type='text'
            placeholder='Search by order number...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 text-sm md:text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='cursor-pointer px-3 md:px-4 py-2 text-sm md:text-base border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2'
        >
          <FunnelIcon className='h-4 w-4 md:h-5 md:w-5 text-neutral-600' />
          <span className='text-sm font-medium text-neutral-700'>Filters</span>
        </button>
      </div>

      {/* Status Filters */}
      {showFilters && (
        <div className='pt-3 md:pt-4 border-t border-neutral-200 space-y-3 md:space-y-4'>
          <div>
            <p className='text-xs md:text-sm font-medium text-neutral-700 mb-2 md:mb-3'>
              Order Status
            </p>
            <div className='flex flex-wrap gap-2'>
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => onStatusChange(status.value)}
                  className={`cursor-pointer px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                    selectedStatus === status.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <p className='text-xs md:text-sm font-medium text-neutral-700 mb-2 md:mb-3'>
              Date Range
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
              <div>
                <label className='block text-xs md:text-sm text-neutral-600 mb-2'>
                  From Date
                </label>
                <input
                  type='date'
                  value={fromDate}
                  max={today}
                  onChange={(e) => {
                    const value = e.target.value;
                    onFromDateChange?.(value);

                    if (toDate && value > toDate) {
                      onToDateChange?.(value);
                    }
                  }}
                  className='w-full px-3 py-2 text-sm md:text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>
              <div>
                <label className='block text-xs md:text-sm text-neutral-600 mb-2'>
                  To Date
                </label>
                <input
                  type='date'
                  value={toDate}
                  min={fromDate}
                  max={today}
                  onChange={(e) => {
                    const value = e.target.value;
                    onToDateChange?.(value);

                    if (fromDate && value < fromDate) {
                      onFromDateChange?.(value);
                    }
                  }}
                  className='w-full px-3 py-2 text-sm md:text-base border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
