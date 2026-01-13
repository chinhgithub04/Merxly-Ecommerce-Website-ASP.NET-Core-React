import { useState, useMemo } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { OrderStats } from '../../components/store/orders/OrderStats';
import { OrderFilters } from '../../components/store/orders/OrderFilters';
import {
  OrdersTable,
  type Order,
} from '../../components/store/orders/OrdersTable';
import { useStoreOrders } from '../../hooks/useStoreOrders';
import { OrderStatus } from '../../types/enums/Status';
import type { StoreSubOrderFilterDto } from '../../types/models/storeOrder';

type OrderStatusFilter =
  | 'All'
  | 'Confirmed'
  | 'Processing'
  | 'Delivering'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export const StoreOrdersPage = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Build filter for API
  const filter = useMemo<StoreSubOrderFilterDto>(() => {
    const apiFilter: StoreSubOrderFilterDto = {
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
  const { data, isLoading, error } = useStoreOrders(filter);

  // Transform API data to UI format
  const orders = useMemo<Order[]>(() => {
    if (!data?.items) return [];
    return data.items.map((item) => ({
      id: item.id,
      subOrderNumber: item.subOrderNumber,
      customerName: item.customerFullName,
      customerEmail: item.customerEmail,
      status: item.status,
      totalAmount: item.totalAmount,
      itemCount: item.totalItems,
      createdAt: item.createdAt,
    }));
  }, [data]);

  // Calculate stats from API data
  const stats = useMemo(() => {
    if (!orders.length) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        totalRevenue: 0,
      };
    }

    return {
      totalOrders: data?.totalCount || 0,
      pendingOrders: orders.filter((o) => o.status === OrderStatus.Confirmed)
        .length,
      processingOrders: orders.filter(
        (o) =>
          o.status === OrderStatus.Processing ||
          o.status === OrderStatus.Delivering
      ).length,
      shippedOrders: orders.filter((o) => o.status === OrderStatus.Shipped)
        .length,
      totalRevenue: orders
        .filter((o) => o.status !== OrderStatus.Cancelled)
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
  }, [orders, data]);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-primary-50 rounded-lg'>
          <ShoppingBagIcon className='h-6 w-6 text-primary-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-neutral-900'>Orders</h1>
          <p className='text-sm text-neutral-600'>
            Manage and track your store orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <OrderStats
        totalOrders={stats.totalOrders}
        pendingOrders={stats.pendingOrders}
        processingOrders={stats.processingOrders}
        shippedOrders={stats.shippedOrders}
        totalRevenue={stats.totalRevenue}
      />

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
          <OrdersTable orders={orders} />

          {/* Pagination Info */}
          {data && (
            <div className='flex items-center justify-between text-sm text-neutral-600'>
              <span>
                Showing {orders.length} of {data.totalCount} orders
              </span>
              <div className='flex items-center gap-2'>
                <span>
                  Page {data.pageNumber} of {data.totalPages}
                </span>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    disabled={data.pageNumber === 1}
                    className='px-3 py-1 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50'
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPageNumber((p) => p + 1)}
                    disabled={data.pageNumber >= data.totalPages}
                    className='px-3 py-1 border border-neutral-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50'
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
