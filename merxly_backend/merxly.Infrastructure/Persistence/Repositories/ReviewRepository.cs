using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Review;
using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using merxly.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ReviewRepository : GenericRepository<Review, Guid>, IReviewRepository
    {
        public ReviewRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<Review?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.ProductVariant)
                .Include(r => r.Medias)
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        }

        public async Task<Review?> GetByIdWithProductVariantDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(r => r.ProductVariant)
                    .ThenInclude(pv => pv.VariantAttributeValues)
                        .ThenInclude(vav => vav.ProductAttributeValue)
                            .ThenInclude(pav => pav.ProductAttribute)
                .Include(r => r.User)
                .Include(r => r.Medias)
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        }

        public async Task<bool> HasUserReviewedOrderItemAsync(string userId, Guid orderItemId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .AnyAsync(r => r.UserId == userId && r.OrderItemId == orderItemId, cancellationToken);
        }

        public async Task<PaginatedResultDto<Review>> GetPaginatedReviewsWithQueryParametersAsync(ReviewQueryParameters queryParameters, CancellationToken cancellationToken = default)
        {
            var query = _dbSet
            .AsNoTracking()
            .Include(r => r.ProductVariant)
                    .ThenInclude(pv => pv.VariantAttributeValues)
                        .ThenInclude(vav => vav.ProductAttributeValue)
                            .ThenInclude(pav => pav.ProductAttribute)
            .Include(r => r.User)
            .Include(r => r.Medias)
            .AsQueryable();

            if (queryParameters.ProductId.HasValue)
            {
                query = query.Where(r => r.ProductId == queryParameters.ProductId.Value);
            }

            if (queryParameters.StoreId.HasValue)
            {
                query = query.Where(r => r.StoreId == queryParameters.StoreId.Value);
            }

            if (queryParameters.Rating.HasValue)
            {
                query = query.Where(r => r.Rating == queryParameters.Rating.Value);
            }

            if (queryParameters.HasMedia.HasValue && queryParameters.HasMedia.Value)
            {
                query = query.Where(r => r.Medias.Any());
            }

            query = queryParameters.SortOrder switch
            {
                SortOrder.Ascending => query.OrderBy(r => r.CreatedAt),
                _ => query.OrderByDescending(r => r.CreatedAt),
            };

            var totalCount = await query.CountAsync();

            var reviews = await query
                .Skip((queryParameters.PageNumber - 1) * queryParameters.PageSize)
                .Take(queryParameters.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResultDto<Review>
            {
                Items = reviews,
                TotalCount = totalCount,
                PageSize = queryParameters.PageSize,
                PageNumber = queryParameters.PageNumber
            };
        }

        public async Task<List<Review>> GetReviewsByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(r => r.User)
                .Include(r => r.Product)
                .Include(r => r.ProductVariant)
                .Include(r => r.Medias)
                .Where(r => r.StoreId == storeId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<Review?> GetReviewByOrderItemIdAsync(Guid orderItemId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.OrderItemId == orderItemId, cancellationToken);
        }
    }
}
