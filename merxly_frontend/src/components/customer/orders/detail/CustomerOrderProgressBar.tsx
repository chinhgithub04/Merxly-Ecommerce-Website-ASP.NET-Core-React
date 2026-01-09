import { TruckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Book, Check, Handshake, Package, PackageCheck } from 'lucide-react';
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
          icon: Book,
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
        icon: Book,
        status: currentIndex > 0 ? 'completed' : 'current',
      },
      {
        label: 'Packaging',
        icon: Package,
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
        icon: Handshake,
        status:
          currentIndex > 3
            ? 'completed'
            : currentIndex === 3
            ? 'current'
            : 'upcoming',
      },
      {
        label: 'Completed',
        icon: PackageCheck,
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
          circle: 'bg-orange-500',
          line: 'bg-orange-500',
          icon: 'text-green-500',
          label: 'opacity-100',
          checked: 'block text-white h-3.5 w-3.5',
        };
      case 'current':
        return {
          circle: 'bg-orange-500',
          line: 'bg-orange-200',
          icon: 'text-orange-500',
          label: 'opacity-100',
          checked: 'hidden',
        };
      case 'cancelled':
        return {
          circle: 'bg-orange-500',
          line: 'bg-orange-500',
          icon: 'text-red-600',
          label: 'text-red-600 font-medium',
          checked: 'hidden',
        };
      default:
        return {
          circle: 'border-2 border-orange-500 bg-white',
          line: 'bg-orange-200',
          icon: 'text-orange-500 opacity-50',
          label: 'opacity-50',
          checked: 'hidden',
        };
    }
  };

  return (
    <div className='py-2 px-12'>
      <div className='relative'>
        {/* Background Line */}
        <div className='absolute top-2 left-9 right-9 h-2 bg-orange-200 rounded-full' />

        {/* Active Progress Bar */}
        <div
          className={`absolute top-2 left-9 h-2 rounded-full transition-all duration-500 bg-orange-500`}
          style={{
            width: isCancelled
              ? 'calc(100% - 60px)'
              : `calc((100% - 60px) * ${currentIndex / (steps.length - 1)})`,
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
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${styles.circle}`}
                >
                  <Check strokeWidth={2.75} className={`${styles.checked}`} />
                </div>
                <Icon className={`mt-5 h-7 w-7 ${styles.icon}`} />
                {/* Label */}
                <span
                  className={`mt-3 text-xs font-semibold text-center transition-colors duration-300 ${styles.label}`}
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
