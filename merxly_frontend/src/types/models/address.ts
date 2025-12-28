export interface CustomerAddressDto {
  id: string;
  fullName: string;
  title: string | null;
  addressLine: string;
  cityCode: number;
  cityName: string;
  wardCode: number;
  wardName: string;
  postalCode: string;
  phoneNumber: string | null;
  isDefault: boolean;
  fullAddress: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCustomerAddressDto {
  fullName: string;
  title?: string | null;
  addressLine: string;
  cityCode: number;
  cityName: string;
  wardCode: number;
  wardName: string;
  postalCode: string;
  phoneNumber?: string | null;
  isDefault: boolean;
}

export interface UpdateCustomerAddressDto {
  fullName?: string;
  title?: string | null;
  addressLine?: string;
  cityCode?: number;
  cityName?: string;
  wardCode?: number;
  wardName?: string;
  postalCode?: string;
  phoneNumber?: string | null;
  isDefault?: boolean;
}

// Province/City API types
export interface CityDto {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  phone_code: number;
}

// Ward API types
export interface WardDto {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  province_code: number;
}
