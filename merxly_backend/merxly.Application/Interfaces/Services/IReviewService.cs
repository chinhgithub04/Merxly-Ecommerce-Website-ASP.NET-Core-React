using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Review;

namespace merxly.Application.Interfaces.Services
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, string userId, CancellationToken cancellationToken = default);
        Task<PaginatedResultDto<ReviewDto>> GetReviewsAsync(ReviewQueryParameters parameters, CancellationToken cancellationToken = default);
        Task<ReviewDto> GetReviewByIdAsync(Guid reviewId, CancellationToken cancellationToken = default);
        Task<ReviewDto> AddSellerReplyAsync(Guid reviewId, CreateSellerReplyDto dto, Guid storeId, CancellationToken cancellationToken = default);
        Task<bool> CanUserReviewOrderItemAsync(string userId, Guid orderItemId, CancellationToken cancellationToken = default);
        Task<SubOrderReviewStatusDto> GetSubOrderReviewStatusAsync(Guid subOrderId, string userId, CancellationToken cancellationToken = default);
    }
}
