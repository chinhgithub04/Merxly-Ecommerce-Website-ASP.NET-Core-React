export interface AddToCartDto {
  productVariantId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartItemDto {
  id: string;
  productVariantId: string;
  productId: string;
  productName: string;
  productImagePublicId: string | null;
  priceAtAdd: number;
  quantity: number;
  stockQuantity: number;
  isAvailable: boolean;
  selectedAttributes: Record<string, string>;
  storeId: string;
  storeName: string;
  createdAt: string;
}

export interface StoreCartGroup {
  storeId: string;
  storeName: string;
  items: CartItemDto[];
  storeSubtotal: number;
}

export interface CartDto {
  id: string;
  cartItems: CartItemDto[];
  totalItems: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string | null;
}
