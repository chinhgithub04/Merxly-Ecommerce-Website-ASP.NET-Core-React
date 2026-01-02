import {
  ShoppingBagIcon,
  CubeIcon,
  TruckIcon,
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { OrderStatus } from '../../../../types/enums/Status';

interface CustomerOrderProgressBarProps {
  status: OrderStatus;
}

interface ProgressStep {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'completed' | 'current' | 'upcoming' | 'cancelled';
}

export const CustomerOrderProgressBar = ({
  status,
}: CustomerOrderProgressBarProps) => {
  // Check if order is cancelled - show special view
  const isCancelled =
    status === OrderStatus.Cancelled ||
    status === OrderStatus.Refunded ||
    status === OrderStatus.Failed;

  // Map backend status to progress step index (0-4 for 5 steps)
  const getProgressIndex = (orderStatus: OrderStatus): number => {
    switch (orderStatus) {
      case OrderStatus.Pending:
      case OrderStatus.Confirmed:
        return 0; // Order Placed
      case OrderStatus.Processing:
        return 1; // Packaging
      case OrderStatus.Delivering:
        return 2; // Delivering
      case OrderStatus.Shipped:
        return 3; // Shipped
      case OrderStatus.Completed:
        return 4; // Completed
      default:
        return 0;
    }
  };

  const currentIndex = getProgressIndex(status);

  // Build the steps based on current status
  const getSteps = (): ProgressStep[] => {
    if (isCancelled) {
      // For cancelled orders, show Order Placed → Cancelled
      return [
        {
          label: 'Order Placed',
          icon: ShoppingBagIcon,
          status: 'completed',
        },
        {
          label:
            status === OrderStatus.Cancelled
              ? 'Cancelled'
              : status === OrderStatus.Refunded
              ? 'Refunded'
              : 'Failed',
          icon: XCircleIcon,
          status: 'cancelled',
        },
      ];
    }

    // Normal flow: Order Placed → Packaging → Delivering → Shipped → Completed
    const steps: ProgressStep[] = [
      {
        label: 'Order Placed',
        icon: ShoppingBagIcon,
        status: currentIndex > 0 ? 'completed' : 'current',
      },
      {
        label: 'Packaging',
        icon: CubeIcon,
        status:
          currentIndex > 1
            ? 'completed'
            : currentIndex === 1
            ? 'current'
            : 'upcoming',
      },
      {
        label: 'Delivering',
        icon: TruckIcon,
        status:
          currentIndex > 2
            ? 'completed'
            : currentIndex === 2
            ? 'current'
            : 'upcoming',
      },
      {
        label: 'Shipped',
        icon: HomeIcon,
        status:
          currentIndex > 3
            ? 'completed'
            : currentIndex === 3
            ? 'current'
            : 'upcoming',
      },
      {
        label: 'Completed',
        icon: CheckCircleIcon,
        status: currentIndex >= 4 ? 'current' : 'upcoming',
      },
    ];

    return steps;
  };

  const steps = getSteps();

  const getStepStyles = (stepStatus: ProgressStep['status']) => {
    switch (stepStatus) {
      case 'completed':
        return {
          circle: 'bg-green-500 text-white',
          line: 'bg-green-500',
          label: 'text-green-600 font-medium',
        };
      case 'current':
        return {
          circle: 'bg-primary-500 text-white ring-4 ring-primary-100',
          line: 'bg-neutral-200',
          label: 'text-primary-600 font-semibold',
        };
      case 'cancelled':
        return {
          circle: 'bg-red-500 text-white',
          line: 'bg-red-500',
          label: 'text-red-600 font-medium',
        };
      default:
        return {
          circle: 'bg-neutral-200 text-neutral-400',
          line: 'bg-neutral-200',
          label: 'text-neutral-400',
        };
    }
  };

  return (
    <div className='py-8 px-4'>
      <div className='relative'>
        {/* Background Line */}
        <div className='absolute top-4 left-5 right-5 h-2 bg-neutral-200 rounded-full' />

        {/* Active Progress Bar */}
        <div
          className={`absolute top-4 left-5 h-2 rounded-full transition-all duration-500 ${
            isCancelled ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{
            width: isCancelled
              ? 'calc(100% - 40px)'
              : `calc((100% - 40px) * ${currentIndex / (steps.length - 1)})`,
          }}
        />

        {/* Steps */}
        <div className='flex justify-between'>
          {steps.map((step, index) => {
            const styles = getStepStyles(step.status);
            const Icon = step.icon;

            return (
              <div key={index} className='flex flex-col items-center relative'>
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${styles.circle}`}
                >
                  <Icon className='h-5 w-5' />
                </div>
                {/* Label */}
                <span
                  className={`mt-2 text-xs text-center transition-colors duration-300 ${styles.label}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
