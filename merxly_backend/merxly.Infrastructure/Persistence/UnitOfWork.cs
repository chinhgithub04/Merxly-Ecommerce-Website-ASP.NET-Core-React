using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public IAddressRepository Address { get; private set; }
        public IApplicationUserRepository ApplicationUser { get; private set; }
        public ICartRepository Cart { get; private set; }
        public ICartItemRepository CartItem { get; private set; }
        public ICategoryRepository Category { get; private set; }
        public IOrderRepository Order { get; private set; }
        public IOrderItemRepository OrderItem { get; private set; }
        public IOrderStatusHistoryRepository OrderStatusHistory { get; private set; }
        public IPaymentRepository Payment { get; private set; }
        public IProductRepository Product { get; private set; }
        public IProductAttributeRepository ProductAttribute { get; private set; }
        public IProductAttributeValueRepository ProductAttributeValue { get; private set; }
        public IProductVariantRepository ProductVariant { get; private set; }
        public IProductVariantMediaRepository ProductVariantMedia { get; private set; }
        public IRefundRepository Refund { get; private set; }
        public IReviewRepository Review { get; private set; }
        public IReviewMediaRepository ReviewMedia { get; private set; }
        public IStoreRepository Store { get; private set; }
        public IStoreAddressRepository StoreAddress { get; private set; }
        public IWishlistRepository Wishlist { get; private set; }
        public IWishlistItemRepository WishlistItem { get; private set; }

        public UnitOfWork(
            ApplicationDbContext context,
            IAddressRepository addressRepository,
            IApplicationUserRepository applicationUserRepository,
            ICartRepository cartRepository,
            ICartItemRepository cartItemRepository,
            ICategoryRepository categoryRepository,
            IOrderRepository orderRepository,
            IOrderItemRepository orderItemRepository,
            IOrderStatusHistoryRepository orderStatusHistoryRepository,
            IPaymentRepository paymentRepository,
            IProductRepository productRepository,
            IProductAttributeRepository productAttributeRepository,
            IProductAttributeValueRepository productAttributeValueRepository,
            IProductVariantRepository productVariantRepository,
            IProductVariantMediaRepository productVariantMediaRepository,
            IRefundRepository refundRepository,
            IReviewRepository reviewRepository,
            IReviewMediaRepository reviewMediaRepository,
            IStoreRepository storeRepository,
            IStoreAddressRepository storeAddressRepository,
            IWishlistRepository wishlistRepository,
            IWishlistItemRepository wishlistItemRepository)
        {
            _context = context;
            Address = addressRepository;
            ApplicationUser = applicationUserRepository;
            Cart = cartRepository;
            CartItem = cartItemRepository;
            Category = categoryRepository;
            Order = orderRepository;
            OrderItem = orderItemRepository;
            OrderStatusHistory = orderStatusHistoryRepository;
            Payment = paymentRepository;
            Product = productRepository;
            ProductAttribute = productAttributeRepository;
            ProductAttributeValue = productAttributeValueRepository;
            ProductVariant = productVariantRepository;
            ProductVariantMedia = productVariantMediaRepository;
            Refund = refundRepository;
            Review = reviewRepository;
            ReviewMedia = reviewMediaRepository;
            Store = storeRepository;
            StoreAddress = storeAddressRepository;
            Wishlist = wishlistRepository;
            WishlistItem = wishlistItemRepository;
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return _context.SaveChangesAsync(cancellationToken);
        }
    }
}
