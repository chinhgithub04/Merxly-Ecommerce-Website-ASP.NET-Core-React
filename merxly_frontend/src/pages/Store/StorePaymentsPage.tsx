import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { PaymentStats } from '../../components/store/payments/PaymentStats';
import { StripeAccountCard } from '../../components/store/payments/StripeAccountCard';
import { PayoutHistory } from '../../components/store/payments/PayoutHistory';
import { TransactionsList } from '../../components/store/payments/TransactionsList';
import { useStoreStripeConnect } from '../../hooks/useStoreStripeConnect';

// Mock data
const mockStats = {
  totalEarnings: 45230,
  pendingPayout: 3420,
  commissionPaid: 4523,
  availableBalance: 8950,
};

const mockPayouts = [
  {
    id: '1',
    amount: 5420,
    status: 'completed' as const,
    date: '2024-12-20T10:00:00',
    method: 'Bank Transfer',
    transactionId: 'po_1ABC123XYZ',
  },
  {
    id: '2',
    amount: 3200,
    status: 'completed' as const,
    date: '2024-12-15T14:30:00',
    method: 'Bank Transfer',
    transactionId: 'po_2DEF456ABC',
  },
  {
    id: '3',
    amount: 3420,
    status: 'pending' as const,
    date: '2024-12-24T09:00:00',
    method: 'Bank Transfer',
    transactionId: 'po_3GHI789DEF',
  },
  {
    id: '4',
    amount: 2150,
    status: 'completed' as const,
    date: '2024-12-10T16:45:00',
    method: 'Bank Transfer',
    transactionId: 'po_4JKL012GHI',
  },
  {
    id: '5',
    amount: 1800,
    status: 'failed' as const,
    date: '2024-12-08T11:20:00',
    method: 'Bank Transfer',
    transactionId: 'po_5MNO345JKL',
  },
];

const mockTransactions = [
  {
    id: '1',
    orderId: 'ORD-2024-001',
    customerName: 'John Smith',
    amount: 129.99,
    commission: 13.0,
    netAmount: 116.99,
    date: '2024-12-23T15:30:00',
    type: 'sale' as const,
  },
  {
    id: '2',
    orderId: 'ORD-2024-002',
    customerName: 'Sarah Johnson',
    amount: 89.5,
    commission: 8.95,
    netAmount: 80.55,
    date: '2024-12-23T14:20:00',
    type: 'sale' as const,
  },
  {
    id: '3',
    orderId: 'ORD-2024-003',
    customerName: 'Michael Brown',
    amount: 45.0,
    commission: 4.5,
    netAmount: 40.5,
    date: '2024-12-22T10:15:00',
    type: 'refund' as const,
  },
  {
    id: '4',
    orderId: 'ORD-2024-004',
    customerName: 'Emily Davis',
    amount: 199.99,
    commission: 20.0,
    netAmount: 179.99,
    date: '2024-12-22T09:45:00',
    type: 'sale' as const,
  },
  {
    id: '5',
    orderId: 'ORD-2024-005',
    customerName: 'David Wilson',
    amount: 75.25,
    commission: 7.53,
    netAmount: 67.72,
    date: '2024-12-21T16:30:00',
    type: 'sale' as const,
  },
  {
    id: '6',
    orderId: 'ORD-2024-006',
    customerName: 'Lisa Martinez',
    amount: 159.99,
    commission: 16.0,
    netAmount: 143.99,
    date: '2024-12-21T13:10:00',
    type: 'sale' as const,
  },
  {
    id: '7',
    orderId: 'ORD-2024-007',
    customerName: 'James Anderson',
    amount: 220.0,
    commission: 22.0,
    netAmount: 198.0,
    date: '2024-12-20T11:25:00',
    type: 'sale' as const,
  },
  {
    id: '8',
    orderId: 'ORD-2024-008',
    customerName: 'Amanda Taylor',
    amount: 99.99,
    commission: 10.0,
    netAmount: 89.99,
    date: '2024-12-20T08:50:00',
    type: 'sale' as const,
  },
];

export const StorePaymentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    account,
    accountStatus,
    isLoading,
    connectStripe,
    continueOnboarding,
    refreshStatus,
    disconnect,
    isConnecting,
    isContinuingOnboarding,
    isRefreshing,
    isDisconnecting,
  } = useStoreStripeConnect();

  // Handle return from Stripe onboarding
  useEffect(() => {
    const onboardingStatus = searchParams.get('onboarding');
    if (onboardingStatus === 'success' || onboardingStatus === 'refresh') {
      // Refresh account status after returning from Stripe
      refreshStatus();
      // Clean up URL params
      setSearchParams({});
    }
  }, [searchParams, refreshStatus, setSearchParams]);

  const handleConnect = async (
    email: string,
    country: string,
    businessType: string
  ) => {
    try {
      const result = await connectStripe({ email, country, businessType });
      if (result.onboardingUrl) {
        // Redirect to Stripe onboarding
        window.location.href = result.onboardingUrl;
      }
    } catch (error) {
      console.error('Failed to connect Stripe:', error);
    }
  };

  const handleContinueOnboarding = async () => {
    try {
      const url = await continueOnboarding();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to continue onboarding:', error);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await refreshStatus();
    } catch (error) {
      console.error('Failed to refresh status:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };
  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-primary-50 rounded-lg'>
          <BanknotesIcon className='h-6 w-6 text-primary-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-neutral-900'>Payments</h1>
          <p className='text-sm text-neutral-600'>
            Manage earnings, payouts, and payment settings
          </p>
        </div>
      </div>

      {/* Payment Stats */}
      <PaymentStats
        totalEarnings={mockStats.totalEarnings}
        pendingPayout={mockStats.pendingPayout}
        commissionPaid={mockStats.commissionPaid}
        availableBalance={mockStats.availableBalance}
      />

      {/* Stripe Account Card */}
      <StripeAccountCard
        isConnected={!!account?.stripeConnectAccountId}
        accountId={account?.stripeConnectAccountId || undefined}
        email={undefined}
        commissionRate={account?.commissionRate || 0}
        accountStatus={
          accountStatus?.status || account?.stripeAccountStatus || null
        }
        isLoading={isLoading}
        onConnect={handleConnect}
        onContinueOnboarding={handleContinueOnboarding}
        onRefreshStatus={handleRefreshStatus}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
        isContinuingOnboarding={isContinuingOnboarding}
        isRefreshing={isRefreshing}
        isDisconnecting={isDisconnecting}
      />

      {/* Payout History */}
      <PayoutHistory payouts={mockPayouts} />

      {/* Transactions List */}
      <TransactionsList transactions={mockTransactions} />
    </div>
  );
};
