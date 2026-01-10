using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IWishlistItemRepository : IGenericRepository<WishlistItem, Guid>
    {
        Task<WishlistItem?> GetWishlistItemAsync(Guid wishlistId, Guid productId, Guid? productVariantId, CancellationToken cancellationToken = default);
    }
}
