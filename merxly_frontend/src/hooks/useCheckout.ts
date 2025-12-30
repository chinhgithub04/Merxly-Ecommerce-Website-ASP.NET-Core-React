import { useMutation } from '@tanstack/react-query';
import { processCheckout } from '../services/checkoutService';
import type { CheckoutRequestDto } from '../types/models/order';

export const useCheckout = () => {
  const checkoutMutation = useMutation({
    mutationFn: processCheckout,
  });

  return {
    processCheckout: (dto: CheckoutRequestDto) =>
      checkoutMutation.mutateAsync(dto),
    isProcessing: checkoutMutation.isPending,
    error: checkoutMutation.error,
  };
};
