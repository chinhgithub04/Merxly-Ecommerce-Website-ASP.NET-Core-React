using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class CartRepository : GenericRepository<Cart, Guid>, ICartRepository
    {
        public CartRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
