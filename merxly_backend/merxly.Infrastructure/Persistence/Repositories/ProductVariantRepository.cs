using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ProductVariantRepository : GenericRepository<ProductVariant, Guid>, IProductVariantRepository
    {
        public ProductVariantRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
