using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ProductVariantMediaRepository : GenericRepository<ProductVariantMedia, Guid>, IProductVariantMediaRepository
    {
        public ProductVariantMediaRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
