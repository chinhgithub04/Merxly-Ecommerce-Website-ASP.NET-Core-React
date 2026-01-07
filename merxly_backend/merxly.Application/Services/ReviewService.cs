using AutoMapper;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Review;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Enums;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ReviewService> _logger;

        public ReviewService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<ReviewService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating review for OrderItemId: {OrderItemId} by UserId: {UserId}", dto.OrderItemId, userId);

            // Get order item with details
            var orderItem = await _unitOfWork.OrderItem.GetByIdWithDetailsAsync(dto.OrderItemId, cancellationToken)
                ?? throw new NotFoundException($"Order item with ID {dto.OrderItemId} not found");

            // Verify ownership
            if (orderItem.SubOrder.Order.UserId != userId)
            {
                throw new ForbiddenAccessException("You don't have permission to review this order item");
            }

            // Check if sub-order is completed
            if (orderItem.SubOrder.Status != OrderStatus.Completed)
            {
                throw new BadRequestException("You can only review completed orders");
            }

            // Check if within 7-day review window
            if (!orderItem.SubOrder.CompletedAt.HasValue)
            {
                throw new BadRequestException("Cannot review order without completion date");
            }

            var daysSinceCompletion = (DateTime.UtcNow - orderItem.SubOrder.CompletedAt.Value).TotalDays;
            if (daysSinceCompletion > 7)
            {
                throw new BadRequestException("Review period has expired. You can only review orders within 7 days of completion");
            }

            // Check if already reviewed
            var alreadyReviewed = await _unitOfWork.Review.HasUserReviewedOrderItemAsync(userId, dto.OrderItemId, cancellationToken);
            if (alreadyReviewed)
            {
                throw new BadRequestException("You have already reviewed this order item");
            }

            // Ensure ProductVariant exists
            if (!orderItem.ProductVariantId.HasValue)
            {
                throw new BadRequestException("Cannot review order item without a product variant");
            }

            var productVariant = orderItem.ProductVariant
                ?? throw new NotFoundException($"Product variant not found for order item {dto.OrderItemId}");

            // Create review
            var review = _mapper.Map<Review>(dto);
            review.UserId = userId;
            review.ProductId = productVariant.ProductId;
            review.ProductVariantId = productVariant.Id;
            review.StoreId = productVariant.Product.StoreId;

            await _unitOfWork.Review.AddAsync(review, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Update product rating and review count
            await UpdateProductRatingAsync(productVariant.ProductId, cancellationToken);


            _logger.LogInformation("Review created successfully with ID: {ReviewId}", review.Id);

            // Get the created review with details
            var createdReview = await _unitOfWork.Review.GetByIdWithDetailsAsync(review.Id, cancellationToken);
            return _mapper.Map<ReviewDto>(createdReview);
        }

        public async Task<PaginatedResultDto<ReviewDto>> GetReviewsAsync(ReviewQueryParameters parameters, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving reviews. ProductId: {ProductId}, StoreId: {StoreId}, PageNumber: {PageNumber}",
                parameters.ProductId, parameters.StoreId, parameters.PageNumber);

            var paginatedReviews = await _unitOfWork.Review.GetPaginatedReviewsWithQueryParametersAsync(parameters, cancellationToken);

            var paginatedResultDto = _mapper.Map<PaginatedResultDto<ReviewDto>>(paginatedReviews);

            _logger.LogInformation("Retrieved {ReviewCount} reviews out of {TotalCount} total reviews",
                paginatedResultDto.Items.Count, paginatedResultDto.TotalCount);

            return paginatedResultDto;
        }

        public async Task<ReviewDto> GetReviewByIdAsync(Guid reviewId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving review with ID: {ReviewId}", reviewId);

            var review = await _unitOfWork.Review.GetByIdWithDetailsAsync(reviewId, cancellationToken)
                ?? throw new NotFoundException($"Review with ID {reviewId} not found");

            return _mapper.Map<ReviewDto>(review);
        }

        public async Task<ReviewDto> AddSellerReplyAsync(Guid reviewId, CreateSellerReplyDto dto, Guid storeId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Adding seller reply to review {ReviewId} by store {StoreId}", reviewId, storeId);

            var review = await _unitOfWork.Review.GetByIdAsync(reviewId, cancellationToken)
                ?? throw new NotFoundException($"Review with ID {reviewId} not found");

            // Verify store ownership
            if (review.StoreId != storeId)
            {
                throw new ForbiddenAccessException("You don't have permission to reply to this review");
            }

            // Check if already replied
            if (!string.IsNullOrEmpty(review.SellerReply))
            {
                throw new BadRequestException("You have already replied to this review");
            }

            review.SellerReply = dto.SellerReply;
            review.SellerRepliedAt = DateTime.UtcNow;
            review.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Review.Update(review);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Seller reply added successfully to review {ReviewId}", reviewId);

            var updatedReview = await _unitOfWork.Review.GetByIdWithDetailsAsync(reviewId, cancellationToken);
            return _mapper.Map<ReviewDto>(updatedReview);
        }

        public async Task<bool> CanUserReviewOrderItemAsync(string userId, Guid orderItemId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Checking if user {UserId} can review order item {OrderItemId}", userId, orderItemId);

            // Get order item with details
            var orderItem = await _unitOfWork.OrderItem.GetByIdWithDetailsAsync(orderItemId, cancellationToken);
            if (orderItem == null)
            {
                return false;
            }

            // Check ownership
            if (orderItem.SubOrder.Order.UserId != userId)
            {
                return false;
            }

            // Check if sub-order is completed
            if (orderItem.SubOrder.Status != OrderStatus.Completed)
            {
                return false;
            }

            // Check if within 7-day review window
            if (!orderItem.SubOrder.CompletedAt.HasValue)
            {
                return false;
            }

            var daysSinceCompletion = (DateTime.UtcNow - orderItem.SubOrder.CompletedAt.Value).TotalDays;
            if (daysSinceCompletion > 7)
            {
                return false;
            }

            // Check if already reviewed
            var alreadyReviewed = await _unitOfWork.Review.HasUserReviewedOrderItemAsync(userId, orderItemId, cancellationToken);
            if (alreadyReviewed)
            {
                return false;
            }

            return true;
        }

        public async Task<SubOrderReviewStatusDto> GetSubOrderReviewStatusAsync(Guid subOrderId, string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting review status for SubOrder {SubOrderId} for user {UserId}", subOrderId, userId);

            // Get sub-order with details
            var subOrder = await _unitOfWork.SubOrder.GetByIdWithDetailsAsync(subOrderId, cancellationToken)
                ?? throw new NotFoundException($"SubOrder with ID {subOrderId} not found");

            // Verify ownership
            if (subOrder.Order.UserId != userId)
            {
                throw new ForbiddenAccessException("You don't have permission to access this sub-order");
            }

            // Check if sub-order is completed
            if (subOrder.Status != OrderStatus.Completed || !subOrder.CompletedAt.HasValue)
            {
                throw new BadRequestException("SubOrder must be completed to check review status");
            }

            // Calculate review window
            var completedAt = subOrder.CompletedAt.Value;
            var daysSinceCompletion = (DateTime.UtcNow - completedAt).TotalDays;
            var isWithinReviewWindow = daysSinceCompletion <= 7;
            var daysRemaining = Math.Max(0, (int)Math.Ceiling(7 - daysSinceCompletion));

            // Get review status for each order item
            var orderItemStatuses = new List<OrderItemReviewStatusDto>();
            bool canLeaveReview = false;

            foreach (var orderItem in subOrder.OrderItems)
            {
                if (!orderItem.ProductVariantId.HasValue || orderItem.ProductVariant == null)
                {
                    continue;
                }

                // Check if this order item has been reviewed
                var hasBeenReviewed = await _unitOfWork.Review.HasUserReviewedOrderItemAsync(userId, orderItem.Id, cancellationToken);

                ReviewDto? existingReview = null;
                if (hasBeenReviewed)
                {
                    // Get the specific review for this order item
                    var review = await _unitOfWork.Review.GetReviewByOrderItemIdAsync(orderItem.Id, cancellationToken);
                    if (review != null)
                    {
                        var reviewWithDetails = await _unitOfWork.Review.GetByIdWithProductVariantDetailsAsync(review.Id, cancellationToken);
                        if (reviewWithDetails != null)
                        {
                            existingReview = _mapper.Map<ReviewDto>(reviewWithDetails);
                        }
                    }
                }

                // If within review window and not reviewed, user can still leave a review
                if (isWithinReviewWindow && !hasBeenReviewed)
                {
                    canLeaveReview = true;
                }

                orderItemStatuses.Add(new OrderItemReviewStatusDto
                {
                    OrderItemId = orderItem.Id,
                    ProductId = orderItem.ProductVariant.ProductId,
                    ProductVariantId = orderItem.ProductVariant.Id,
                    ProductVariantName = orderItem.ProductVariant.Name,
                    MainMediaPublicId = _unitOfWork.ProductVariant.GetMainMediaIdByProductVariantIdAsync(orderItem.ProductVariant.Id, cancellationToken).Result,
                    HasBeenReviewed = hasBeenReviewed,
                    ExistingReview = existingReview
                });
            }

            return new SubOrderReviewStatusDto
            {
                SubOrderId = subOrder.Id,
                SubOrderNumber = subOrder.SubOrderNumber,
                CompletedAt = completedAt,
                IsWithinReviewWindow = isWithinReviewWindow,
                DaysRemainingToReview = daysRemaining,
                CanLeaveReview = canLeaveReview,
                OrderItems = orderItemStatuses
            };
        }

        private async Task UpdateProductRatingAsync(Guid productId, CancellationToken cancellationToken)
        {
            var product = await _unitOfWork.Product.GetByIdAsync(productId, cancellationToken);
            if (product == null) return;

            var queryParameters = new ReviewQueryParameters
            {
                ProductId = productId,
                PageNumber = 1,
                PageSize = int.MaxValue
            };

            var paginatedReviews = await _unitOfWork.Review.GetPaginatedReviewsWithQueryParametersAsync(queryParameters, cancellationToken);

            if (paginatedReviews.Items.Any())
            {
                product.AverageRating = paginatedReviews.Items.Average(r => r.Rating);
                product.ReviewCount = paginatedReviews.TotalCount;
                _unitOfWork.Product.Update(product);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
