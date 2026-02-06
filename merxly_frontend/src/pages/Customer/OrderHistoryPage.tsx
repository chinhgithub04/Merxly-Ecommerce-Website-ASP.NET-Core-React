import { useState, useMemo } from 'react';
import { OrderFilters } from '../../components/store/orders/OrderFilters';
import {
  CustomerOrdersTable,
  type CustomerOrder,
} from '../../components/customer/orders/CustomerOrdersTable';
import { useCustomerOrders } from '../../hooks/useCustomerOrders';
import { OrderStatus } from '../../types/enums/Status';
import type { CustomerSubOrderFilterDto } from '../../types/models/customerOrder';

type OrderStatusFilter =
  | 'All'
  | 'Confirmed'
  | 'Processing'
  | 'Delivering'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export const OrderHistoryPage = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Build filter for API
  const filter = useMemo<CustomerSubOrderFilterDto>(() => {
    const apiFilter: CustomerSubOrderFilterDto = {
      pageNumber,
      pageSize,
    };

    if (selectedStatus !== 'All') {
      // Map UI status to enum value
      const statusMap: Record<OrderStatusFilter, OrderStatus> = {
        All: OrderStatus.Confirmed, // Not used
        Confirmed: OrderStatus.Confirmed,
        Processing: OrderStatus.Processing,
        Delivering: OrderStatus.Delivering,
        Shipped: OrderStatus.Shipped,
        Completed: OrderStatus.Completed,
        Cancelled: OrderStatus.Cancelled,
      };
      apiFilter.status = statusMap[selectedStatus];
    }

    if (searchTerm.trim()) {
      apiFilter.searchTerm = searchTerm.trim();
    }

    if (fromDate) {
      apiFilter.fromDate = fromDate;
    }

    if (toDate) {
      apiFilter.toDate = toDate;
    }

    return apiFilter;
  }, [selectedStatus, searchTerm, fromDate, toDate, pageNumber]);

  // Fetch orders from API
  const { data, isLoading, error } = useCustomerOrders(filter);

  // Transform API data to UI format
  const orders = useMemo<CustomerOrder[]>(() => {
    if (!data?.items) return [];
    return data.items.map((item) => ({
      id: item.id,
      subOrderNumber: item.subOrderNumber,
      storeName: item.storeName,
      status: item.status,
      totalAmount: item.totalAmount,
      itemCount: item.totalItems,
      createdAt: item.createdAt,
    }));
  }, [data]);

  return (
    <div className='p-4 md:p-6 lg:p-10'>
      {/* Page Header */}
      <div className='bg-white border-t border-x border-neutral-200 rounded-t-lg px-4 md:px-6 py-3 md:py-4'>
        <h2 className='text-lg md:text-xl font-semibold text-neutral-900'>
          Order History
        </h2>
      </div>

      {/* Filters */}
      <OrderFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
      />

      {/* Loading State */}
      {isLoading && (
        <div className='text-center py-12'>
          <p className='text-neutral-500'>Loading orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-700'>
            Failed to load orders. Please try again later.
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !error && (
        <>
          <CustomerOrdersTable orders={orders} />

          {/* Pagination Info */}
          {data && data.totalCount > 0 && (
            <div className='flex flex-col sm:flex-row mt-2 items-start sm:items-center justify-between gap-2 text-xs md:text-sm text-neutral-600 px-2'>
              <span>
                Showing {orders.length} of {data.totalCount} orders
              </span>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                <span>
                  Page {data.pageNumber} of {data.totalPages}
                </span>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    disabled={data.pageNumber === 1}
                    className='px-3 py-1 text-xs md:text-sm border border-neutral-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50'
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPageNumber((p) => p + 1)}
                    disabled={data.pageNumber >= data.totalPages}
                    className='px-3 py-1 text-xs md:text-sm border border-neutral-300 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50'
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
