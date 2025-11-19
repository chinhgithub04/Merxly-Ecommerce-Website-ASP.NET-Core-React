using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ProductAttributeRepository : GenericRepository<ProductAttribute, Guid>, IProductAttributeRepository
    {
        public ProductAttributeRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
