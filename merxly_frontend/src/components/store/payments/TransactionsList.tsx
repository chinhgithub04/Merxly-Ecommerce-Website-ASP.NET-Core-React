import { useState } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  commission: number;
  netAmount: number;
  date: string;
  type: 'sale' | 'refund';
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'refund'>(
    'all'
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
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
            className='flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors'
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
              placeholder='Search by order ID or customer name...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          {showFilters && (
            <div className='flex gap-2 p-4 bg-neutral-50 rounded-lg'>
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('sale')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'sale'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setFilterType('refund')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'refund'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Refunds
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-neutral-50 border-b border-neutral-200'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Date
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Order ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Customer
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Type
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Amount
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Commission
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider'>
                Net Amount
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-neutral-200'>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className='hover:bg-neutral-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-neutral-700'>
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600'>
                  #{transaction.orderId}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-neutral-900'>
                  {transaction.customerName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'sale'
                        ? 'bg-success-100 text-success-700'
                        : 'bg-error-100 text-error-700'
                    }`}
                  >
                    {transaction.type === 'sale' ? 'Sale' : 'Refund'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-neutral-900'>
                  {transaction.type === 'refund' && '-'}$
                  {transaction.amount.toFixed(2)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-right text-error-600'>
                  -${transaction.commission.toFixed(2)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-neutral-900'>
                  {transaction.type === 'refund' && '-'}$
                  {transaction.netAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className='p-12 text-center'>
          <p className='text-neutral-500'>
            {searchTerm || filterType !== 'all'
              ? 'No transactions match your filters'
              : 'No transactions available'}
          </p>
        </div>
      )}
    </div>
  );
};
