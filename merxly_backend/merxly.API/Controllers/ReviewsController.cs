using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Review;
using merxly.Application.Interfaces.Repositories;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : BaseApiController
    {
        private readonly IReviewService _reviewService;
        private readonly IStoreRepository _storeRepository;

        public ReviewsController(IReviewService reviewService, IStoreRepository storeRepository)
        {
            _reviewService = reviewService;
            _storeRepository = storeRepository;
        }

        /// <summary>
        /// Get reviews with filtering and pagination
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<PaginatedResultDto<ReviewDto>>>> GetReviews(
            [FromQuery] ReviewQueryParameters parameters,
            CancellationToken cancellationToken)
        {
            var result = await _reviewService.GetReviewsAsync(parameters, cancellationToken);
            return OkResponse(result, "Reviews retrieved successfully");
        }

        /// <summary>
        /// Get a specific review by ID
        /// </summary>
        // [HttpGet("{reviewId}")]
        // public async Task<ActionResult<ResponseDto<ReviewDto>>> GetReviewById(
        //     Guid reviewId,
        //     CancellationToken cancellationToken)
        // {
        //     var result = await _reviewService.GetReviewByIdAsync(reviewId, cancellationToken);
        //     return OkResponse(result, "Review retrieved successfully");
        // }

        /// <summary>
        /// Create a review for an order item (Customer only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = UserRoles.Customer)]
        public async Task<ActionResult<ResponseDto<ReviewDto>>> CreateReview(
            [FromBody] CreateReviewDto dto,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var result = await _reviewService.CreateReviewAsync(dto, userId, cancellationToken);
            return OkResponse(result, "Review created successfully");
        }

        /// <summary>
        /// Add seller reply to a review (Store Owner only)
        /// </summary>
        [HttpPost("{reviewId}/reply")]
        [Authorize(Roles = UserRoles.StoreOwner)]
        public async Task<ActionResult<ResponseDto<ReviewDto>>> AddSellerReply(
            Guid reviewId,
            [FromBody] CreateSellerReplyDto dto,
            CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);

            var result = await _reviewService.AddSellerReplyAsync(reviewId, dto, storeId.Value, cancellationToken);
            return OkResponse(result, "Seller reply added successfully");
        }

        /// <summary>
        /// Check if user can review an order item (Customer only)
        /// </summary>
        // [HttpGet("can-review/{orderItemId}")]
        // [Authorize(Roles = "Customer")]
        // public async Task<ActionResult<ResponseDto<bool>>> CanReviewOrderItem(
        //     Guid orderItemId,
        //     CancellationToken cancellationToken)
        // {
        //     var userId = GetUserIdFromClaims();
        //     var result = await _reviewService.CanUserReviewOrderItemAsync(userId, orderItemId, cancellationToken);
        //     return OkResponse(result, result ? "You can review this order item" : "You cannot review this order item");
        // }

        /// <summary>
        /// Get review status for a SubOrder including all OrderItems and their reviews (Customer only)
        /// This endpoint supports the UI flow for "Leave a Rating" vs "See your Review" buttons
        /// </summary>
        [HttpGet("sub-order/{subOrderId}/status")]
        [Authorize(Roles = UserRoles.Customer)]
        public async Task<ActionResult<ResponseDto<SubOrderReviewStatusDto>>> GetSubOrderReviewStatus(
            Guid subOrderId,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var result = await _reviewService.GetSubOrderReviewStatusAsync(subOrderId, userId, cancellationToken);
            return OkResponse(result, "SubOrder review status retrieved successfully");
        }
    }
}
