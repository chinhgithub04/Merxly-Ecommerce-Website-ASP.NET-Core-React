using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ProductAttributeValueRepository : GenericRepository<ProductAttributeValue, Guid>, IProductAttributeValueRepository
    {
        public ProductAttributeValueRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
