using AutoMapper;
using merxly.Application.DTOs.Wishlist;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<WishlistService> _logger;

        public WishlistService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<WishlistService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<WishlistDto> AddToWishlistAsync(string userId, AddToWishlistDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Adding product {ProductId} to wishlist for user: {UserId}", dto.ProductId, userId);

            var wishlist = await _unitOfWork.Wishlist.GetWishlistWithItemsByUserIdAsync(userId, cancellationToken);
            if (wishlist == null)
            {
                _logger.LogInformation("No wishlist found for user: {UserId}. Creating a new wishlist.", userId);
                wishlist = new Wishlist
                {
                    UserId = userId,
                };
                await _unitOfWork.Wishlist.AddAsync(wishlist, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("New wishlist created for user: {UserId} with ID: {WishlistId}", userId, wishlist.Id);
            }

            // Check if the product exists and is active
            var product = await _unitOfWork.Product.GetByIdAsync(dto.ProductId, cancellationToken);
            if (product == null || !product.IsActive)
            {
                _logger.LogWarning("Product {ProductId} not found or inactive", dto.ProductId);
                throw new NotFoundException($"Product with ID {dto.ProductId} not found or is not available");
            }

            // If ProductVariantId is provided, check if it exists and is active
            if (dto.ProductVariantId.HasValue)
            {
                var productVariant = await _unitOfWork.ProductVariant.GetByIdAsync(dto.ProductVariantId.Value, cancellationToken);
                if (productVariant == null || !productVariant.IsActive || productVariant.ProductId != dto.ProductId)
                {
                    _logger.LogWarning("Product variant {VariantId} not found, inactive, or doesn't belong to product {ProductId}", dto.ProductVariantId, dto.ProductId);
                    throw new NotFoundException($"Product variant with ID {dto.ProductVariantId} not found or is not available");
                }
            }

            // Check if the item already exists in the wishlist
            var wishlistItem = await _unitOfWork.WishlistItem.GetWishlistItemAsync(wishlist.Id, dto.ProductId, dto.ProductVariantId, cancellationToken);
            if (wishlistItem != null)
            {
                _logger.LogInformation("Item already exists in wishlist for user: {UserId}", userId);
                throw new InvalidOperationException("This item is already in your wishlist");
            }

            // Create new wishlist item
            _logger.LogInformation("Creating new wishlist item for product {ProductId}", dto.ProductId);
            wishlistItem = new WishlistItem
            {
                WishlistId = wishlist.Id,
                ProductId = dto.ProductId,
                ProductVariantId = dto.ProductVariantId
            };
            await _unitOfWork.WishlistItem.AddAsync(wishlistItem, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            _logger.LogInformation("Product {ProductId} added to wishlist for user: {UserId}", dto.ProductId, userId);

            // Refresh wishlist with updated data
            wishlist = await _unitOfWork.Wishlist.GetWishlistWithItemsByUserIdAsync(userId, cancellationToken);
            var wishlistDto = _mapper.Map<WishlistDto>(wishlist);
            return wishlistDto;
        }

        public async Task ClearWishlistAsync(string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Clearing wishlist for user: {UserId}", userId);

            var wishlist = await _unitOfWork.Wishlist.GetWishlistWithItemsByUserIdAsync(userId, cancellationToken);
            if (wishlist == null)
            {
                _logger.LogWarning("Wishlist not found for user: {UserId}", userId);
                throw new NotFoundException($"Wishlist not found for user {userId}");
            }

            if (wishlist.WishlistItems.Any())
            {
                _unitOfWork.WishlistItem.RemoveRange(wishlist.WishlistItems);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Wishlist cleared successfully for user: {UserId}. Removed {ItemCount} items", userId, wishlist.WishlistItems.Count);
            }
            else
            {
                _logger.LogInformation("Wishlist is already empty for user: {UserId}", userId);
            }
        }

        public async Task<WishlistDto> GetWishlistAsync(string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving wishlist for user: {UserId}", userId);

            var wishlist = await _unitOfWork.Wishlist.GetWishlistWithItemsByUserIdAsync(userId, cancellationToken);
            if (wishlist == null)
            {
                _logger.LogInformation("No wishlist found for user: {UserId}. Creating a new wishlist.", userId);
                wishlist = new Wishlist
                {
                    UserId = userId,
                };
                await _unitOfWork.Wishlist.AddAsync(wishlist, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                _logger.LogInformation("New wishlist created for user: {UserId} with ID: {WishlistId}", userId, wishlist.Id);
            }

            var wishlistDto = _mapper.Map<WishlistDto>(wishlist);
            _logger.LogInformation("Successfully retrieved wishlist for user: {UserId} with {ItemCount} items", userId, wishlistDto.TotalItems);

            return wishlistDto;
        }

        public async Task RemoveWishlistItemAsync(string userId, Guid wishlistItemId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Removing wishlist item {WishlistItemId} for user: {UserId}", wishlistItemId, userId);

            var wishlist = await _unitOfWork.Wishlist.GetWishlistWithItemsByUserIdAsync(userId, cancellationToken);
            if (wishlist == null)
            {
                _logger.LogWarning("Wishlist not found for user: {UserId}", userId);
                throw new NotFoundException($"Wishlist not found for user {userId}");
            }

            var wishlistItem = wishlist.WishlistItems.FirstOrDefault(wi => wi.Id == wishlistItemId);
            if (wishlistItem == null)
            {
                _logger.LogWarning("Wishlist item {WishlistItemId} not found in wishlist for user: {UserId}", wishlistItemId, userId);
                throw new NotFoundException($"Wishlist item with ID {wishlistItemId} not found");
            }

            _unitOfWork.WishlistItem.Remove(wishlistItem);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Wishlist item {WishlistItemId} removed successfully for user: {UserId}", wishlistItemId, userId);
        }
    }
}
