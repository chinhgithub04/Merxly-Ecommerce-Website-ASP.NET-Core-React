using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ProductVariantRepository : GenericRepository<ProductVariant, Guid>, IProductVariantRepository
    {
        public ProductVariantRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<string?> GetMainMediaIdByProductVariantIdAsync(Guid productVariantId, CancellationToken cancellationToken = default)
        {
            var productVariant = await _dbSet
                .Include(pv => pv.Media)
                .FirstOrDefaultAsync(pv => pv.Id == productVariantId, cancellationToken);

            var mainMedia = productVariant?.Media.FirstOrDefault(m => m.IsMain);
            return mainMedia?.MediaPublicId;
        }
    }
}
