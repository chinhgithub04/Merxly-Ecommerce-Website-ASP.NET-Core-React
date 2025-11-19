using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class WishlistRepository : GenericRepository<Wishlist, Guid>, IWishlistRepository
    {
        public WishlistRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
