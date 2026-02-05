import { XMarkIcon } from '@heroicons/react/24/outline';

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersBarProps {
  filters: ActiveFilter[];
  totalResults: number;
  searchTerm?: string;
  onRemoveFilter: (key: string) => void;
}

export const ActiveFiltersBar = ({
  filters,
  totalResults,
  searchTerm,
  onRemoveFilter,
}: ActiveFiltersBarProps) => {
  if (filters.length === 0) {
    return (
      <div className='bg-neutral-100 px-4 md:px-6 py-4 rounded-lg mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <p className='text-xs md:text-sm text-neutral-600'>
            No active filters
          </p>
          <p className='text-xs md:text-sm font-medium text-neutral-900'>
            {totalResults} results found
            {searchTerm ? ` for "${searchTerm}"` : ''}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-neutral-100 px-4 md:px-6 py-4 rounded-lg mb-6'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        {/* Active Filters */}
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-xs md:text-sm font-medium text-neutral-700'>
            Active filter:
          </span>
          {filters.map((filter) => (
            <div
              key={filter.key}
              className='flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg'
            >
              <span className='text-xs md:text-sm text-neutral-700'>
                {filter.label}
              </span>
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className='text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer'
                aria-label={`Remove ${filter.label} filter`}
              >
                <XMarkIcon className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <p className='text-xs md:text-sm font-medium text-neutral-900 whitespace-nowrap'>
          {totalResults} results found{searchTerm ? ` for "${searchTerm}"` : ''}
        </p>
      </div>
    </div>
  );
};
