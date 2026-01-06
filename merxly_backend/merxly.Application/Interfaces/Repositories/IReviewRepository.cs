using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Review;
using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IReviewRepository : IGenericRepository<Review, Guid>
    {
        Task<Review?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> HasUserReviewedOrderItemAsync(string userId, Guid orderItemId, CancellationToken cancellationToken = default);
        Task<PaginatedResultDto<Review>> GetPaginatedReviewsWithQueryParametersAsync(ReviewQueryParameters queryParameters, CancellationToken cancellationToken = default);
        Task<List<Review>> GetReviewsByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default);
        Task<Review?> GetReviewByOrderItemIdAsync(Guid orderItemId, CancellationToken cancellationToken = default);
        Task<Review?> GetByIdWithProductVariantDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
