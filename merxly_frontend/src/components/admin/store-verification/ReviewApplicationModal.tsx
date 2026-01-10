import { useState } from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import type { StoreListItemDto } from '../../../types/models/store';
import {
  useApproveStore,
  useRejectStore,
  useAdminStoreDetail,
} from '../../../hooks/useAdminStores';
import { getProductImageUrl } from '../../../utils/cloudinaryHelpers';

interface ReviewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: StoreListItemDto | null;
  readOnly?: boolean;
}

export const ReviewApplicationModal = ({
  isOpen,
  onClose,
  application,
  readOnly = false,
}: ReviewApplicationModalProps) => {
  const [commissionRate, setCommissionRate] = useState('0.1');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const approveMutation = useApproveStore();
  const rejectMutation = useRejectStore();

  // Fetch full store details
  const { data: storeDetailResponse, isLoading: isLoadingDetail } =
    useAdminStoreDetail(application?.id || null);
  const storeDetail = storeDetailResponse?.data;

  if (!isOpen || !application) return null;

  const handleApprove = () => {
    const rate = parseFloat(commissionRate);
    if (rate < 0 || rate > 1) {
      alert('Commission rate must be between 0 and 1 (0% to 100%)');
      return;
    }
    approveMutation.mutate(
      {
        storeId: application.id,
        dto: { commissionRate: rate },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    if (rejectionReason.length > 500) {
      alert('Rejection reason must be 500 characters or less');
      return;
    }
    rejectMutation.mutate(
      {
        storeId: application.id,
        dto: { rejectionReason: rejectionReason.trim() },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  const handleClose = () => {
    setShowApproveConfirm(false);
    setShowRejectConfirm(false);
    setCommissionRate('0.1');
    setRejectionReason('');
    onClose();
  };

  const logoUrl = application.logoImagePublicId
    ? getProductImageUrl(application.logoImagePublicId, 'logo')
    : null;

  const bannerUrl = storeDetail?.bannerImagePublicId
    ? getProductImageUrl(storeDetail.bannerImagePublicId, 'banner')
    : null;

  const identityCardFrontUrl = storeDetail?.identityCardFrontPublicId
    ? getProductImageUrl(storeDetail.identityCardFrontPublicId, 'detail')
    : null;

  const identityCardBackUrl = storeDetail?.identityCardBackPublicId
    ? getProductImageUrl(storeDetail.identityCardBackPublicId, 'detail')
    : null;

  const businessLicenseUrl = storeDetail?.bussinessLicensePublicId
    ? getProductImageUrl(storeDetail.bussinessLicensePublicId, 'detail')
    : null;

  const isProcessing = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div
      className='fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={handleClose}
    >
      <div
        className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-neutral-200'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-primary-50 rounded-lg'>
              <BuildingStorefrontIcon className='h-6 w-6 text-primary-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-neutral-900'>
                Review Store Application
              </h2>
              <p className='text-sm text-neutral-600'>
                {application.storeName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className='cursor-pointer text-neutral-400 hover:text-neutral-600'
          >
            <XMarkIcon className='h-6 w-6' />
          </button>
        </div>

        {/* Content */}
        {isLoadingDetail ? (
          <div className='p-12 text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
            <p className='text-neutral-600'>Loading store details...</p>
          </div>
        ) : (
          <div className='p-6 space-y-6'>
            {/* Store Logo */}
            {logoUrl && (
              <div className='flex justify-center'>
                <div className='text-center'>
                  <p className='text-xs font-medium text-neutral-600 mb-3'>
                    Store Logo
                  </p>
                  <div className='inline-block'>
                    <img
                      src={logoUrl}
                      alt='Store logo'
                      className='w-32 h-32 object-cover rounded-lg border-2 border-neutral-200 shadow-md'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Store Banner */}
            {bannerUrl && (
              <div>
                <p className='text-xs font-medium text-neutral-600 mb-3'>
                  Store Banner
                </p>
                <img
                  src={bannerUrl}
                  alt='Store banner'
                  className='w-full h-40 object-cover rounded-lg border border-neutral-200 shadow-sm'
                />
              </div>
            )}

            {/* Required Documents */}
            {storeDetail && (
              <div className='bg-neutral-50 rounded-lg p-6 border border-neutral-200'>
                <h3 className='text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2'>
                  <DocumentTextIcon className='h-5 w-5 text-primary-600' />
                  Required Documents
                </h3>

                {/* Identity Cards - Side by Side */}
                <div className='mb-6'>
                  <p className='text-xs font-medium text-neutral-700 mb-3'>
                    Identity Cards
                  </p>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-xs text-neutral-500 mb-2'>Front</p>
                      {identityCardFrontUrl ? (
                        <img
                          src={identityCardFrontUrl}
                          alt='Identity Card Front'
                          className='w-full h-56 object-cover rounded-lg border border-neutral-300 shadow-sm hover:shadow-md transition-shadow'
                        />
                      ) : (
                        <div className='w-full h-56 bg-white rounded-lg border border-dashed border-neutral-300 flex items-center justify-center'>
                          <DocumentTextIcon className='h-12 w-12 text-neutral-300' />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className='text-xs text-neutral-500 mb-2'>Back</p>
                      {identityCardBackUrl ? (
                        <img
                          src={identityCardBackUrl}
                          alt='Identity Card Back'
                          className='w-full h-56 object-cover rounded-lg border border-neutral-300 shadow-sm hover:shadow-md transition-shadow'
                        />
                      ) : (
                        <div className='w-full h-56 bg-white rounded-lg border border-dashed border-neutral-300 flex items-center justify-center'>
                          <DocumentTextIcon className='h-12 w-12 text-neutral-300' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business License - Centered, Taller */}
                <div>
                  <p className='text-xs font-medium text-neutral-700 mb-3'>
                    Business License
                  </p>
                  <div className='flex justify-center'>
                    {businessLicenseUrl ? (
                      <img
                        src={businessLicenseUrl}
                        alt='Business License'
                        className='max-w-2xl w-full h-96 object-contain rounded-lg border border-neutral-300 shadow-sm hover:shadow-md transition-shadow bg-white p-4'
                      />
                    ) : (
                      <div className='max-w-2xl w-full h-96 bg-white rounded-lg border border-dashed border-neutral-300 flex items-center justify-center'>
                        <div className='text-center'>
                          <DocumentTextIcon className='h-16 w-16 text-neutral-300 mx-auto mb-2' />
                          <p className='text-sm text-neutral-400'>
                            No document uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Store Information */}
            <div className='bg-white rounded-lg p-6 border border-neutral-200 shadow-sm'>
              <h3 className='text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2'>
                <BuildingStorefrontIcon className='h-5 w-5 text-primary-600' />
                Store Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-xs font-medium text-neutral-500'>
                    Store Name
                  </p>
                  <p className='text-sm text-neutral-900 font-semibold'>
                    {application.storeName}
                  </p>
                </div>

                {application.taxCode && (
                  <div className='space-y-1'>
                    <p className='text-xs font-medium text-neutral-500'>
                      Tax Code
                    </p>
                    <p className='text-sm text-neutral-900 font-mono'>
                      {application.taxCode}
                    </p>
                  </div>
                )}

                {application.website && (
                  <div className='space-y-1 md:col-span-2'>
                    <p className='text-xs font-medium text-neutral-500'>
                      Website
                    </p>
                    <a
                      href={application.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1'
                    >
                      <GlobeAltIcon className='h-4 w-4' />
                      {application.website}
                    </a>
                  </div>
                )}

                {application.description && (
                  <div className='space-y-1 md:col-span-2'>
                    <p className='text-xs font-medium text-neutral-500'>
                      Description
                    </p>
                    <p className='text-sm text-neutral-700 leading-relaxed'>
                      {application.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Information */}
            <div className='bg-white rounded-lg p-6 border border-neutral-200 shadow-sm'>
              <h3 className='text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2'>
                <EnvelopeIcon className='h-5 w-5 text-primary-600' />
                Owner Information
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-xs font-medium text-neutral-500'>
                    Owner Name
                  </p>
                  <p className='text-sm text-neutral-900 font-semibold'>
                    {application.ownerName}
                  </p>
                </div>

                <div className='space-y-1'>
                  <p className='text-xs font-medium text-neutral-500'>
                    Phone Number
                  </p>
                  <p className='text-sm text-neutral-900 inline-flex items-center gap-1'>
                    <PhoneIcon className='h-4 w-4 text-neutral-400' />
                    {application.phoneNumber}
                  </p>
                </div>

                <div className='space-y-1 md:col-span-2'>
                  <p className='text-xs font-medium text-neutral-500'>
                    Email Address
                  </p>
                  <p className='text-sm text-neutral-900'>
                    {application.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            {readOnly &&
              application.status === 'Rejected' &&
              storeDetail?.rejectionReason && (
                <div className='bg-error-50 rounded-lg p-6 border border-error-200 shadow-sm'>
                  <h3 className='text-sm font-semibold text-error-900 mb-4 flex items-center gap-2'>
                    <XCircleIcon className='h-5 w-5 text-error-600' />
                    Rejection Reason
                  </h3>
                  <div className='bg-white rounded-lg p-4 border border-error-200'>
                    <p className='text-sm text-neutral-900 leading-relaxed'>
                      {storeDetail.rejectionReason}
                    </p>
                  </div>
                </div>
              )}

            {/* Approve Section */}
            {!readOnly && !showRejectConfirm && (
              <div className='border border-success-200 rounded-lg p-4 bg-success-50'>
                <h3 className='text-sm font-medium text-success-900 mb-3'>
                  Approve Application
                </h3>
                {!showApproveConfirm ? (
                  <div>
                    <label className='block text-sm text-neutral-700 mb-2'>
                      Commission Rate (decimal: 0-1, e.g., 0.1 for 10%)
                    </label>
                    <input
                      type='number'
                      min='0'
                      max='1'
                      step='0.01'
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3'
                      placeholder='0.1'
                      disabled={isProcessing}
                    />
                    <p className='text-xs text-neutral-600 mb-3'>
                      The store will pay this percentage on each sale as a
                      platform commission. Enter as decimal (e.g., 0.1 = 10%).
                    </p>
                    <button
                      onClick={() => setShowApproveConfirm(true)}
                      className='flex items-center gap-2 px-4 py-2 bg-success-600 text-white text-sm font-medium rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      disabled={isProcessing}
                    >
                      <CheckCircleIcon className='h-5 w-5' />
                      Approve Store
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className='text-sm text-success-900 mb-3'>
                      Are you sure you want to approve this store with a{' '}
                      {(parseFloat(commissionRate) * 100).toFixed(2)}%
                      commission rate?
                    </p>
                    <div className='flex gap-3'>
                      <button
                        onClick={handleApprove}
                        className='px-4 py-2 bg-success-600 text-white text-sm font-medium rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Confirm Approval'}
                      </button>
                      <button
                        onClick={() => setShowApproveConfirm(false)}
                        className='px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isProcessing}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reject Section */}
            {!readOnly && !showApproveConfirm && (
              <div className='border border-error-200 rounded-lg p-4 bg-error-50'>
                <h3 className='text-sm font-medium text-error-900 mb-3'>
                  Reject Application
                </h3>
                {!showRejectConfirm ? (
                  <div>
                    <label className='block text-sm text-neutral-700 mb-2'>
                      Reason for Rejection (max 500 characters)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      maxLength={500}
                      className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-1'
                      placeholder='Explain why this application is being rejected...'
                      disabled={isProcessing}
                    />
                    <p className='text-xs text-neutral-600 mb-3'>
                      {rejectionReason.length}/500 characters
                    </p>
                    <button
                      onClick={() => setShowRejectConfirm(true)}
                      className='flex items-center gap-2 px-4 py-2 bg-error-600 text-white text-sm font-medium rounded-lg hover:bg-error-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      disabled={isProcessing}
                    >
                      <XCircleIcon className='h-5 w-5' />
                      Reject Store
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className='text-sm text-error-900 mb-3'>
                      Are you sure you want to reject this application? The
                      store owner will be notified.
                    </p>
                    <div className='flex gap-3'>
                      <button
                        onClick={handleReject}
                        className='px-4 py-2 bg-error-600 text-white text-sm font-medium rounded-lg hover:bg-error-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                      </button>
                      <button
                        onClick={() => setShowRejectConfirm(false)}
                        className='px-4 py-2 border border-neutral-300 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isProcessing}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
