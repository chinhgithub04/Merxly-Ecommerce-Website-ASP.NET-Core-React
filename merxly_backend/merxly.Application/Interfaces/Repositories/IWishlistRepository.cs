using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IWishlistRepository : IGenericRepository<Wishlist, Guid>
    {
        Task<Wishlist?> GetWishlistByUserIdAsync(string userId, CancellationToken cancellationToken = default);
        Task<Wishlist?> GetWishlistWithItemsByUserIdAsync(string userId, CancellationToken cancellationToken = default);
    }
}
