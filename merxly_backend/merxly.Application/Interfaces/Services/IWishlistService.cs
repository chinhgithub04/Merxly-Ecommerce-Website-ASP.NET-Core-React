using merxly.Application.DTOs.Wishlist;

namespace merxly.Application.Interfaces.Services
{
    public interface IWishlistService
    {
        Task<WishlistDto> GetWishlistAsync(string userId, CancellationToken cancellationToken = default);
        Task<WishlistDto> AddToWishlistAsync(string userId, AddToWishlistDto dto, CancellationToken cancellationToken = default);
        Task RemoveWishlistItemAsync(string userId, Guid wishlistItemId, CancellationToken cancellationToken = default);
        Task ClearWishlistAsync(string userId, CancellationToken cancellationToken = default);
    }
}
