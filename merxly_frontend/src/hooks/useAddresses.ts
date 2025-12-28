import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCustomerAddresses,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from '../services/addressService';
import type {
  CreateCustomerAddressDto,
  UpdateCustomerAddressDto,
} from '../types/models/address';

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: getCustomerAddresses,
  });

  const createAddressMutation = useMutation({
    mutationFn: createCustomerAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({
      addressId,
      dto,
    }: {
      addressId: string;
      dto: UpdateCustomerAddressDto;
    }) => updateCustomerAddress(addressId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: deleteCustomerAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  return {
    addresses: data?.data || [],
    isLoading,
    error,
    createAddress: (dto: CreateCustomerAddressDto) =>
      createAddressMutation.mutateAsync(dto),
    updateAddress: (addressId: string, dto: UpdateCustomerAddressDto) =>
      updateAddressMutation.mutateAsync({ addressId, dto }),
    deleteAddress: (addressId: string) =>
      deleteAddressMutation.mutateAsync(addressId),
    isCreatingAddress: createAddressMutation.isPending,
    isUpdatingAddress: updateAddressMutation.isPending,
    isDeletingAddress: deleteAddressMutation.isPending,
  };
};
