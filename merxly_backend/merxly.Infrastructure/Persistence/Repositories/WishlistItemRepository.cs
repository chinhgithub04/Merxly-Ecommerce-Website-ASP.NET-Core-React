using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class WishlistItemRepository : GenericRepository<WishlistItem, Guid>, IWishlistItemRepository
    {
        public WishlistItemRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
