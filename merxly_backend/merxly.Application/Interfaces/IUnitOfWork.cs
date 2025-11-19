using merxly.Application.Interfaces.Repositories;

namespace merxly.Application.Interfaces
{
    public interface IUnitOfWork
    {
        IAddressRepository Address { get; }
        IApplicationUserRepository ApplicationUser { get; }
        ICartRepository Cart { get; }
        ICartItemRepository CartItem { get; }
        ICategoryRepository Category { get; }
        IOrderRepository Order { get; }
        IOrderItemRepository OrderItem { get; }
        IOrderStatusHistoryRepository OrderStatusHistory { get; }
        IPaymentRepository Payment { get; }
        IProductRepository Product { get; }
        IProductAttributeRepository ProductAttribute { get; }
        IProductAttributeValueRepository ProductAttributeValue { get; }
        IProductVariantRepository ProductVariant { get; }
        IProductVariantMediaRepository ProductVariantMedia { get; }
        IRefundRepository Refund { get; }
        IReviewRepository Review { get; }
        IReviewMediaRepository ReviewMedia { get; }
        IStoreRepository Store { get; }
        IStoreAddressRepository StoreAddress { get; }
        IWishlistRepository Wishlist { get; }
        IWishlistItemRepository WishlistItem { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
