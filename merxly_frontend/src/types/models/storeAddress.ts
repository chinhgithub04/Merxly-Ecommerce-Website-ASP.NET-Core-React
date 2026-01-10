export interface StoreAddressDto {
  id: string;
  addressLine: string;
  cityCode: number;
  cityName: string;
  wardCode: number;
  wardName: string;
  postalCode: string;
  fullAddress: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateStoreAddressDto {
  addressLine: string;
  cityCode: number;
  cityName: string;
  wardCode: number;
  wardName: string;
  postalCode: string;
}

export interface UpdateStoreAddressDto {
  addressLine?: string;
  cityCode?: number;
  cityName?: string;
  wardCode?: number;
  wardName?: string;
  postalCode?: string;
}
