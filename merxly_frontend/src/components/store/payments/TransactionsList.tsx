import { useState } from 'react';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import type { StoreTransferDto } from '../../../types/models/storeTransaction';
import { StoreTransferStatus } from '../../../types/enums';
import { Modal } from '../../ui/Modal';
import { useStoreTransaction } from '../../../hooks/useStoreTransactions';

interface TransactionsListProps {
  transactions: StoreTransferDto[];
  isLoading?: boolean;
}

export const TransactionsList = ({
  transactions,
  isLoading,
}: TransactionsListProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | StoreTransferStatus>(
    'all'
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const { data: transactionDetailResponse, isLoading: isLoadingDetail } =
    useStoreTransaction(selectedTransactionId || '');

  const transactionDetail = transactionDetailResponse?.data || null;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.subOrderNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || transaction.status === filterStatus;

    // Date range filter
    const transactionDate = new Date(transaction.createdAt);
    const matchesFromDate = !fromDate || transactionDate >= new Date(fromDate);
    const matchesToDate =
      !toDate || transactionDate <= new Date(toDate + 'T23:59:59');

    // Amount range filter
    const transactionAmount = transaction.amount;
    const matchesMinAmount =
      !minAmount || transactionAmount >= parseFloat(minAmount);
    const matchesMaxAmount =
      !maxAmount || transactionAmount <= parseFloat(maxAmount);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFromDate &&
      matchesToDate &&
      matchesMinAmount &&
      matchesMaxAmount
    );
  });

  const getStatusBadge = (status: StoreTransferStatus) => {
    switch (status) {
      case StoreTransferStatus.Completed:
        return 'bg-success-100 text-success-700';
      case StoreTransferStatus.Pending:
        return 'bg-yellow-100 text-yellow-700';
      case StoreTransferStatus.Processing:
        return 'bg-blue-100 text-blue-700';
      case StoreTransferStatus.Failed:
        return 'bg-error-100 text-error-700';
      case StoreTransferStatus.Cancelled:
        return 'bg-neutral-100 text-neutral-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusLabel = (status: StoreTransferStatus) => {
    switch (status) {
      case StoreTransferStatus.Completed:
        return 'Completed';
      case StoreTransferStatus.Pending:
        return 'Pending';
      case StoreTransferStatus.Processing:
        return 'Processing';
      case StoreTransferStatus.Failed:
        return 'Failed';
      case StoreTransferStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const handleViewDetail = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
  };

  const handleCloseModal = () => {
    setSelectedTransactionId(null);
  };

  const handleNavigateToOrder = (subOrderId: string) => {
    navigate(`/store/orders/${subOrderId}`);
  };

  return (
    <>
      <div className='bg-white rounded-lg border border-neutral-200'>
        <div className='p-6 border-b border-neutral-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-lg font-semibold text-neutral-900'>
                Transaction History
              </h2>
              <p className='text-sm text-neutral-600 mt-1'>
                Detailed breakdown of all transactions
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='cursor-pointer flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors'
            >
              <FunnelIcon className='h-5 w-5' />
              Filters
            </button>
          </div>

          {/* Search and Filters */}
          <div className='space-y-4'>
            <div className='relative'>
              <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400' />
              <input
                type='text'
                placeholder='Search by sub order number...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              />
            </div>

            {showFilters && (
              <div className='space-y-4 p-4 bg-neutral-50 rounded-lg'>
                {/* Status Filters */}
                <div>
                  <label className='block text-sm font-medium text-neutral-700 mb-2'>
                    Status
                  </label>
                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() =>
                        setFilterStatus(StoreTransferStatus.Completed)
                      }
                      className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === StoreTransferStatus.Completed
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() =>
                        setFilterStatus(StoreTransferStatus.Pending)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === StoreTransferStatus.Pending
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() =>
                        setFilterStatus(StoreTransferStatus.Failed)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === StoreTransferStatus.Failed
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      Failed
                    </button>
                  </div>
                </div>

                {/* Date Range Filter */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-neutral-700 mb-2'>
                      From Date
                    </label>
                    <input
                      type='date'
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-neutral-700 mb-2'>
                      To Date
                    </label>
                    <input
                      type='date'
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                </div>

                {/* Amount Range Filter */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-neutral-700 mb-2'>
                      Min Amount (₫)
                    </label>
                    <input
                      type='number'
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder='0'
                      min='0'
                      className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-neutral-700 mb-2'>
                      Max Amount (₫)
                    </label>
                    <input
                      type='number'
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder='No limit'
                      min='0'
                      className='w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className='flex justify-end pt-2'>
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setFromDate('');
                      setToDate('');
                      setMinAmount('');
                      setMaxAmount('');
                      setSearchTerm('');
                    }}
                    className='cursor-pointer px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors'
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-neutral-50 border-b border-neutral-200'>
              <tr>
                <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Date
                </th>
                <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Order Number
                </th>
                <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Status
                </th>
                <th className='text-right py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Sub Total
                </th>
                <th className='text-right py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Commission
                </th>
                <th className='text-right py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Net Amount
                </th>
                <th className='text-left py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Transferred
                </th>
                <th className='text-center py-3 px-4 text-sm font-semibold text-neutral-700'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-neutral-200'>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className='px-6 py-12 text-center'>
                    <div className='flex justify-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className='hover:bg-neutral-50 transition-colors'
                  >
                    <td className='py-3 px-4'>
                      <span className='text-sm text-neutral-700'>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <button
                        onClick={() =>
                          handleNavigateToOrder(transaction.subOrderId)
                        }
                        className='text-sm cursor-pointer font-medium text-primary-600 hover:text-primary-700 hover:underline'
                      >
                        {transaction.subOrderNumber}
                      </button>
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusBadge(
                          transaction.status
                        )}`}
                      >
                        {getStatusLabel(transaction.status)}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-right'>
                      <span className='text-sm font-semibold text-neutral-900'>
                        ₫
                        {(
                          transaction.amount + transaction.commission
                        ).toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-right'>
                      <span className='text-sm text-error-600'>
                        -₫{transaction.commission.toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-right'>
                      <span className='text-sm font-semibold text-neutral-900'>
                        ₫{transaction.amount.toLocaleString('vi-VN')}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <span className='text-sm text-neutral-700'>
                        {transaction.transferredAt
                          ? new Date(
                              transaction.transferredAt
                            ).toLocaleDateString()
                          : '-'}
                      </span>
                    </td>
                    <td className='py-3 px-4'>
                      <div className='flex items-center justify-center'>
                        <button
                          onClick={() => handleViewDetail(transaction.id)}
                          className='cursor-pointer p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
                          title='View Details'
                        >
                          <EyeIcon className='h-5 w-5' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredTransactions.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-neutral-500'>
              {searchTerm ||
              filterStatus !== 'all' ||
              fromDate ||
              toDate ||
              minAmount ||
              maxAmount
                ? 'No transactions match your filters'
                : 'No transactions found'}
            </p>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={!!selectedTransactionId}
        onClose={handleCloseModal}
        title='Transaction Details'
        doneLabel='Close'
      >
        {isLoadingDetail ? (
          <div className='flex justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
          </div>
        ) : transactionDetail ? (
          <div className='space-y-6'>
            {/* Transaction Info */}
            <div className='space-y-4'>
              <div className='flex justify-between items-center pb-4 border-b border-neutral-200'>
                <span className='text-sm text-neutral-600'>Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    transactionDetail.status
                  )}`}
                >
                  {getStatusLabel(transactionDetail.status)}
                </span>
              </div>

              <div className='flex justify-between items-center pb-4 border-b border-neutral-200'>
                <span className='text-sm text-neutral-600'>
                  Sub Order Number
                </span>
                <button
                  onClick={() =>
                    handleNavigateToOrder(transactionDetail.subOrderId)
                  }
                  className='text-sm cursor-pointer font-medium text-primary-600 hover:text-primary-700 hover:underline'
                >
                  {transactionDetail.subOrderNumber}
                </button>
              </div>

              {transactionDetail.stripeTransferId && (
                <div className='flex justify-between items-center pb-4 border-b border-neutral-200'>
                  <span className='text-sm text-neutral-600'>
                    Stripe Transfer ID
                  </span>
                  <span className='text-sm font-mono text-neutral-900'>
                    {transactionDetail.stripeTransferId}
                  </span>
                </div>
              )}

              <div className='flex justify-between items-center pb-4 border-b border-neutral-200'>
                <span className='text-sm text-neutral-600'>
                  Payment Intent ID
                </span>
                <span className='text-sm font-mono text-neutral-900'>
                  {transactionDetail.paymentIntentId}
                </span>
              </div>

              <div className='flex justify-between items-center pb-4 border-b border-neutral-200'>
                <span className='text-sm text-neutral-600'>Currency</span>
                <span className='text-sm font-medium text-neutral-900 uppercase'>
                  {transactionDetail.currency}
                </span>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className='space-y-3 bg-neutral-50 rounded-lg p-4'>
              <h3 className='text-sm font-semibold text-neutral-900 mb-3'>
                Amount Breakdown
              </h3>

              <div className='flex justify-between items-center'>
                <span className='text-sm text-neutral-600'>
                  Sub Order Total
                </span>
                <span className='text-sm font-medium text-neutral-900'>
                  ₫{transactionDetail.subOrderTotal.toLocaleString('vi-VN')}
                </span>
              </div>

              <div className='flex justify-between items-center'>
                <span className='text-sm text-neutral-600'>Commission</span>
                <span className='text-sm font-medium text-error-600'>
                  -₫{transactionDetail.commission.toLocaleString('vi-VN')}
                </span>
              </div>

              <div className='flex justify-between items-center pt-3 border-t border-neutral-200'>
                <span className='text-sm font-semibold text-neutral-900'>
                  Net Amount
                </span>
                <span className='text-lg font-bold text-neutral-900'>
                  ₫{transactionDetail.amount.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Dates */}
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-neutral-600'>Created At</span>
                <span className='text-sm text-neutral-900'>
                  {new Date(transactionDetail.createdAt).toLocaleString()}
                </span>
              </div>

              {transactionDetail.transferredAt && (
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-neutral-600'>
                    Transferred At
                  </span>
                  <span className='text-sm text-neutral-900'>
                    {new Date(transactionDetail.transferredAt).toLocaleString()}
                  </span>
                </div>
              )}

              {transactionDetail.updatedAt && (
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-neutral-600'>Updated At</span>
                  <span className='text-sm text-neutral-900'>
                    {new Date(transactionDetail.updatedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Failure Message */}
            {transactionDetail.failureMessage && (
              <div className='bg-error-50 border border-error-200 rounded-lg p-4'>
                <h3 className='text-sm font-semibold text-error-900 mb-2'>
                  Failure Reason
                </h3>
                <p className='text-sm text-error-700'>
                  {transactionDetail.failureMessage}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className='text-center py-8'>
            <p className='text-neutral-500'>Transaction details not found</p>
          </div>
        )}
      </Modal>
    </>
  );
};
