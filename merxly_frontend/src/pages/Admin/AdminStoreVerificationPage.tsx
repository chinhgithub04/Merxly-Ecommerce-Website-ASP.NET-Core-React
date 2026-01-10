import { useState } from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { StoreApplicationCard } from '../../components/admin/store-verification/StoreApplicationCard';
import { ReviewApplicationModal } from '../../components/admin/store-verification/ReviewApplicationModal';
import { useAdminStores } from '../../hooks/useAdminStores';
import type { StoreListItemDto } from '../../types/models/store';

type FilterStatus = 'all' | 'Pending' | 'Approved' | 'Rejected';

export const AdminStoreVerificationPage = () => {
  const { data: storesResponse, isLoading, error } = useAdminStores();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedApplication, setSelectedApplication] =
    useState<StoreListItemDto | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const stores = storesResponse?.data || [];

  const handleReview = (application: StoreListItemDto) => {
    setSelectedApplication(application);
    setIsReviewModalOpen(true);
  };

  const filteredApplications =
    filterStatus === 'all'
      ? stores
      : stores.filter((store) => store.status === filterStatus);

  const stats = {
    total: stores.length,
    pending: stores.filter((store) => store.status === 'Pending').length,
    approved: stores.filter((store) => store.status === 'Approved').length,
    rejected: stores.filter((store) => store.status === 'Rejected').length,
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
          <p className='text-neutral-600'>Loading store applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-error-600 mb-2'>
            Failed to load store applications
          </p>
          <p className='text-sm text-neutral-600'>
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-primary-50 rounded-lg'>
          <CheckBadgeIcon className='h-6 w-6 text-primary-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-neutral-900'>
            Store Verification
          </h1>
          <p className='text-sm text-neutral-600'>
            Review and approve new store registration applications
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg border border-neutral-200 p-6'>
          <p className='text-sm text-neutral-600 mb-1'>Total Applications</p>
          <p className='text-3xl font-bold text-neutral-900'>{stats.total}</p>
        </div>
        <div className='bg-white rounded-lg border border-warning-200 p-6'>
          <p className='text-sm text-neutral-600 mb-1'>Pending Review</p>
          <p className='text-3xl font-bold text-warning-600'>{stats.pending}</p>
        </div>
        <div className='bg-white rounded-lg border border-success-200 p-6'>
          <p className='text-sm text-neutral-600 mb-1'>Approved</p>
          <p className='text-3xl font-bold text-success-600'>
            {stats.approved}
          </p>
        </div>
        <div className='bg-white rounded-lg border border-error-200 p-6'>
          <p className='text-sm text-neutral-600 mb-1'>Rejected</p>
          <p className='text-3xl font-bold text-error-600'>{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='bg-white rounded-lg border border-neutral-200 p-1 inline-flex'>
        <button
          onClick={() => setFilterStatus('all')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filterStatus === 'all'
              ? 'bg-primary-50 text-primary-700'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterStatus('Pending')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filterStatus === 'Pending'
              ? 'bg-warning-50 text-warning-700'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilterStatus('Approved')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filterStatus === 'Approved'
              ? 'bg-success-50 text-success-700'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Approved ({stats.approved})
        </button>
        <button
          onClick={() => setFilterStatus('Rejected')}
          className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filterStatus === 'Rejected'
              ? 'bg-error-50 text-error-700'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          Rejected ({stats.rejected})
        </button>
      </div>

      {/* Applications List */}
      <div className='space-y-4'>
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <StoreApplicationCard
              key={application.id}
              application={application}
              onReview={handleReview}
            />
          ))
        ) : (
          <div className='bg-white rounded-lg border border-neutral-200 p-12 text-center'>
            <CheckBadgeIcon className='h-12 w-12 text-neutral-300 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-neutral-900 mb-2'>
              No Applications Found
            </h3>
            <p className='text-neutral-600'>
              There are no {filterStatus === 'all' ? '' : filterStatus}{' '}
              applications to display.
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewApplicationModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        application={selectedApplication}
        readOnly={selectedApplication?.status !== 'Pending'}
      />
    </div>
  );
};
