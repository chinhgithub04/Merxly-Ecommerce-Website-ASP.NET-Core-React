using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IAddressRepository : IGenericRepository<Address, Guid>
    {
        Task<List<Address>> GetAddressesByUserIdAsync(string userId, CancellationToken cancellationToken = default);
        Task<Address?> GetAddressByIdAndUserIdAsync(Guid addressId, string userId, CancellationToken cancellationToken = default);
        Task<Address?> GetDefaultAddressByUserIdAsync(string userId, CancellationToken cancellationToken = default);
        Task<bool> HasDefaultAddressAsync(string userId, CancellationToken cancellationToken = default);
        Task UnsetAllDefaultAddressesAsync(string userId, CancellationToken cancellationToken = default);
    }
}
