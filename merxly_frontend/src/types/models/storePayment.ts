export interface StorePaymentAccountDto {
  storeId: string;
  storeName: string;
  stripeConnectAccountId: string | null;
  isPayoutEnabled: boolean;
  stripeAccountStatus: string | null;
  commissionRate: number;
}

export interface CreateConnectAccountDto {
  country: string;
  email: string;
  businessType: string;
}

export interface ConnectAccountLinkDto {
  accountLinkUrl: string;
  expiresAt: string;
}

export interface CreateAccountLinkRequestDto {
  returnUrl: string;
  refreshUrl: string;
  type?: string;
}

export interface ConnectAccountStatusDto {
  stripeAccountId: string;
  status: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements: string[];
  pendingVerification: string[];
  errors: string[];
}
