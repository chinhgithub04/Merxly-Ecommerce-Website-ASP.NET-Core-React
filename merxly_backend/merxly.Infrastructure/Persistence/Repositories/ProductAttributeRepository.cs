using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ProductAttributeRepository : GenericRepository<ProductAttribute, Guid>, IProductAttributeRepository
    {
        public ProductAttributeRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<ProductAttribute?> GetProductAttributeWithValuesByIdAsync(Guid productAttributeId, CancellationToken cancellationToken = default)
        {
            var productAttribute = await _dbSet
                .AsNoTracking()
                .Include(pa => pa.ProductAttributeValues)
                .Include(pa => pa.Product)
                .ThenInclude(p => p.Variants)
                .ThenInclude(v => v.VariantAttributeValues)
                .ThenInclude(vav => vav.ProductAttributeValue)
                .ThenInclude(pav => pav.ProductAttribute)
                .FirstOrDefaultAsync(pa => pa.Id == productAttributeId, cancellationToken);
                
            return productAttribute;
        }
    }
}
