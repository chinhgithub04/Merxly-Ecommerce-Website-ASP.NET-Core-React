using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class WishlistItemRepository : GenericRepository<WishlistItem, Guid>, IWishlistItemRepository
    {
        public WishlistItemRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<WishlistItem?> GetWishlistItemAsync(Guid wishlistId, Guid productId, Guid? productVariantId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .FirstOrDefaultAsync(wi =>
                    wi.WishlistId == wishlistId &&
                    wi.ProductId == productId &&
                    wi.ProductVariantId == productVariantId,
                    cancellationToken);
        }
    }
}
