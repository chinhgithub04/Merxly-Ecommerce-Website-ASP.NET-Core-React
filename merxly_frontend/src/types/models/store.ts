export interface DetailStoreDto {
  id: string;
  storeName: string;
  description: string | null;
  logoImagePublicId: string | null;
  bannerImagePublicId: string | null;
  email: string;
  phoneNumber: string;
  website: string | null;
  isActive: boolean;
  isVerified: boolean;
  commissionRate: number;
  createdAt: string;
  ownerId: string;
  ownerName: string;
}

export interface CreateStoreDto {
  storeName: string;
  description?: string | null;
  logoImagePublicId?: string | null;
  bannerImagePublicId?: string | null;
  identityCardFrontPublicId: string;
  identityCardBackPublicId: string;
  bussinessLicensePublicId: string;
  taxCode: string;
  email: string;
  phoneNumber: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhoneNumber?: string | null;
  website?: string | null;
}

export interface UpdateStoreDto {
  storeName?: string;
  description?: string;
  logoImagePublicId?: string;
  bannerImagePublicId?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  isActive?: boolean;
}

// Admin Store Management Types
export interface StoreListItemDto {
  id: string;
  storeName: string;
  description: string | null;
  logoImagePublicId: string | null;
  ownerName: string;
  email: string;
  phoneNumber: string;
  taxCode: string;
  website: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  ownerId: string;
}

export interface AdminStoreDetailDto {
  id: string;
  storeName: string;
  description: string | null;
  logoImagePublicId: string | null;
  bannerImagePublicId: string | null;
  identityCardFrontPublicId: string;
  identityCardBackPublicId: string;
  bussinessLicensePublicId: string;
  taxCode: string;
  email: string;
  phoneNumber: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhoneNumber: string | null;
  website: string | null;
  isActive: boolean;
  isVerified: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason: string | null;
  commissionRate: number;
  createdAt: string;
  updatedAt: string | null;
  ownerId: string;
}

export interface ApproveStoreDto {
  commissionRate?: number;
}

export interface RejectStoreDto {
  rejectionReason: string;
}
