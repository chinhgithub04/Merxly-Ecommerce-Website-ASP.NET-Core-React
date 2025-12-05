using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using merxly.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ProductRepository : GenericRepository<Product, Guid>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<PaginatedResultDto<Product>> GetPaginatedProductsWithQueryParametersAsync(ProductQueryParameters queryParameters, CancellationToken cancellationToken = default)
        {
            IQueryable<Product> query = _dbSet.AsNoTracking().Include(p => p.Category).Include(p => p.Store);

            // Filtering
            if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
            {
                string searchTerm = queryParameters.SearchTerm.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(searchTerm) ||
                                        (p.Description != null && p.Description.ToLower().Contains(searchTerm)));
            }

            if (queryParameters.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == queryParameters.CategoryId.Value);
            }

            if (queryParameters.MinPrice.HasValue)
            {
                query = query.Where(p => p.MaxPrice >= queryParameters.MinPrice.Value);
            }

            if (queryParameters.MaxPrice.HasValue)
            {
                query = query.Where(p => p.MinPrice <= queryParameters.MaxPrice.Value);
            }

            if (queryParameters.MinRating.HasValue)
            {
                query = query.Where(p => p.AverageRating >= queryParameters.MinRating.Value);
            }

            if (queryParameters.IsStoreFeatured.HasValue)
            {
                query = query.Where(p => p.IsStoreFeatured == queryParameters.IsStoreFeatured.Value);
            }

            if (queryParameters.IsPlatformFeatured.HasValue)
            {
                query = query.Where(p => p.IsPlatformFeatured == queryParameters.IsPlatformFeatured.Value);
            }

            if (queryParameters.StoreId.HasValue)
            {
                query = query.Where(p => p.StoreId == queryParameters.StoreId.Value);
            }

            // Sorting
            query = queryParameters.SortBy switch
            {
                ProductSortBy.PlatformFeatured => query.OrderByDescending(p => p.IsPlatformFeatured)
                                            .ThenByDescending(p => p.TotalSold)
                                            .ThenByDescending(p => p.AverageRating)
                                            .ThenByDescending(p => p.CreatedAt),

                ProductSortBy.StoreFeatured => query.OrderByDescending(p => p.IsStoreFeatured)
                                            .ThenByDescending(p => p.TotalSold)
                                            .ThenByDescending(p => p.AverageRating)
                                            .ThenByDescending(p => p.CreatedAt),

                ProductSortBy.PriceLowToHigh => query.OrderBy(p => p.MinPrice)
                                            .ThenByDescending(p => p.TotalSold)
                                            .ThenByDescending(p => p.AverageRating)
                                            .ThenByDescending(p => p.CreatedAt),

                ProductSortBy.PriceHighToLow => query.OrderByDescending(p => p.MaxPrice)
                                            .ThenByDescending(p => p.TotalSold)
                                            .ThenByDescending(p => p.AverageRating)
                                            .ThenByDescending(p => p.CreatedAt),

                ProductSortBy.BestSelling => query.OrderByDescending(p => p.TotalSold)
                                            .ThenByDescending(p => p.AverageRating)
                                            .ThenByDescending(p => p.CreatedAt),

                ProductSortBy.Rating => query.OrderByDescending(p => p.AverageRating)
                                            .ThenByDescending(p => p.TotalSold)
                                            .ThenByDescending(p => p.CreatedAt),

                ProductSortBy.Newest => query.OrderByDescending(p => p.CreatedAt),

                _ => query.OrderByDescending(p => p.IsPlatformFeatured)
                .ThenByDescending(p => p.TotalSold)
                .ThenByDescending(p => p.AverageRating)
                .ThenByDescending(p => p.CreatedAt)     
            };

            // Pagination
            int totalCount = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((queryParameters.PageNumber - 1) * queryParameters.PageSize)
                .Take(queryParameters.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResultDto<Product>
            {
                Items = items,
                TotalCount = totalCount,
                PageSize = queryParameters.PageSize,
                PageNumber = queryParameters.PageNumber
            };
        }

        public async Task<Product?> GetProductDetailsByIdAsync(Guid productId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .Include(p => p.ProductAttributes)
                .ThenInclude(pa => pa.ProductAttributeValues)
                .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
        }

        public async Task<Product?> GetProductWithVariantsByIdAsync(Guid productId, CancellationToken cancellationToken = default)
        {
            var product = await _dbSet
                .AsNoTracking()
                .Include(p => p.Variants)
                .ThenInclude(v => v.VariantAttributeValues)
                .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
                
            return product;
        }

        public async Task<Product?> GetProductWithAttributesByIdAsync(Guid productId, CancellationToken cancellationToken = default)
        {
            var product = await _dbSet
                .AsNoTracking()
                .Include(p => p.ProductAttributes)
                .Include(p => p.Variants)
                .ThenInclude(pa => pa.VariantAttributeValues)
                .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
                
            return product;
        }
    }
}
