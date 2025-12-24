import { useState, useMemo } from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { OrderStats } from '../../components/store/orders/OrderStats';
import { OrderFilters } from '../../components/store/orders/OrderFilters';
import {
  OrdersTable,
  type Order,
} from '../../components/store/orders/OrdersTable';
import { OrderDetailsModal } from '../../components/store/orders/OrderDetailsModal';

// Hardcoded orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-1245',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    status: 'Processing',
    totalAmount: 299.99,
    itemCount: 3,
    createdAt: '2024-12-24T10:30:00',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-1244',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    status: 'Shipped',
    totalAmount: 149.5,
    itemCount: 2,
    createdAt: '2024-12-24T09:15:00',
    shippedAt: '2024-12-24T14:00:00',
    carrier: 'FedEx',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-1243',
    customerName: 'Michael Brown',
    customerEmail: 'mbrown@example.com',
    status: 'Delivered',
    totalAmount: 89.99,
    itemCount: 1,
    createdAt: '2024-12-23T15:20:00',
    shippedAt: '2024-12-23T18:00:00',
    deliveredAt: '2024-12-24T11:30:00',
    carrier: 'UPS',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-1242',
    customerName: 'Emily Davis',
    customerEmail: 'emily.davis@example.com',
    status: 'Confirmed',
    totalAmount: 425.0,
    itemCount: 5,
    createdAt: '2024-12-23T12:45:00',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-1241',
    customerName: 'David Wilson',
    customerEmail: 'dwilson@example.com',
    status: 'Pending',
    totalAmount: 199.99,
    itemCount: 2,
    createdAt: '2024-12-22T16:10:00',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-1240',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@example.com',
    status: 'Cancelled',
    totalAmount: 75.5,
    itemCount: 1,
    createdAt: '2024-12-22T10:30:00',
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-1239',
    customerName: 'James Martinez',
    customerEmail: 'jmartinez@example.com',
    status: 'Delivered',
    totalAmount: 349.99,
    itemCount: 4,
    createdAt: '2024-12-21T14:20:00',
    shippedAt: '2024-12-21T18:00:00',
    deliveredAt: '2024-12-23T10:15:00',
    carrier: 'DHL',
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-1238',
    customerName: 'Patricia Taylor',
    customerEmail: 'ptaylor@example.com',
    status: 'Processing',
    totalAmount: 156.75,
    itemCount: 2,
    createdAt: '2024-12-21T11:00:00',
  },
];

// Mock order details
const mockOrderDetails = {
  orderNumber: 'ORD-2024-1245',
  customerName: 'John Smith',
  customerEmail: 'john.smith@example.com',
  status: 'Processing',
  totalAmount: 299.99,
  subTotal: 279.99,
  tax: 20.0,
  shippingCost: 0,
  createdAt: '2024-12-24T10:30:00',
  shippingAddress: {
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  items: [
    {
      id: '1',
      productName: 'Wireless Headphones Pro',
      variantDetails: 'Color: Black, Size: Standard',
      quantity: 1,
      unitPrice: 149.99,
      totalPrice: 149.99,
    },
    {
      id: '2',
      productName: 'USB-C Cable 3m',
      variantDetails: 'Length: 3m',
      quantity: 2,
      unitPrice: 25.0,
      totalPrice: 50.0,
    },
    {
      id: '3',
      productName: 'Phone Case Premium',
      variantDetails: 'Color: Blue, Material: Silicone',
      quantity: 1,
      unitPrice: 80.0,
      totalPrice: 80.0,
    },
  ],
  notes: 'Please handle with care',
};

type OrderStatus =
  | 'All'
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export const StoreOrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Filter orders based on status and search
  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesStatus =
        selectedStatus === 'All' || order.status === selectedStatus;
      const matchesSearch =
        searchTerm === '' ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [selectedStatus, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter((o) => o.status === 'Pending').length,
      processingOrders: mockOrders.filter(
        (o) => o.status === 'Processing' || o.status === 'Confirmed'
      ).length,
      shippedOrders: mockOrders.filter((o) => o.status === 'Shipped').length,
      totalRevenue: mockOrders
        .filter((o) => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };
  }, []);

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleUpdateStatus = (orderId: string, status: string) => {
    console.log(`Updating order ${orderId} to status ${status}`);
    // In real app, this would call an API
  };

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
      />

      {/* Orders Table */}
      <OrdersTable
        orders={filteredOrders}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Pagination Info */}
      <div className='flex items-center justify-between text-sm text-neutral-600'>
        <span>
          Showing {filteredOrders.length} of {mockOrders.length} orders
        </span>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        order={mockOrderDetails}
      />
    </div>
  );
};
