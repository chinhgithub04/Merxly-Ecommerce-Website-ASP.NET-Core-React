using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class WishlistRepository : GenericRepository<Wishlist, Guid>, IWishlistRepository
    {
        public WishlistRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<Wishlist?> GetWishlistByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);
        }

        public async Task<Wishlist?> GetWishlistWithItemsByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            var wishlist = await _dbSet
                .Include(w => w.WishlistItems.OrderByDescending(wi => wi.CreatedAt))
                    .ThenInclude(wi => wi.Product)
                        .ThenInclude(p => p.Store)
                .Include(w => w.WishlistItems)
                    .ThenInclude(wi => wi.ProductVariant)
                        .ThenInclude(pv => pv.Media)
                .Include(w => w.WishlistItems)
                    .ThenInclude(wi => wi.ProductVariant)
                        .ThenInclude(pv => pv.VariantAttributeValues)
                            .ThenInclude(vav => vav.ProductAttributeValue)
                                .ThenInclude(pav => pav.ProductAttribute)
                .FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);

            if (wishlist != null && wishlist.WishlistItems.Any())
            {
                wishlist.WishlistItems = wishlist.WishlistItems.OrderByDescending(wi => wi.CreatedAt).ToList();
            }

            return wishlist;
        }
    }
}
