using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IStoreAddressRepository : IGenericRepository<StoreAddress, Guid>
    {
        Task<StoreAddress?> GetByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default);
    }
}
