using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IStoreRepository : IGenericRepository<Store, Guid>
    {
        Task<Guid?> GetStoreIdByOwnerIdAsync(string ownerId, CancellationToken cancellationToken = default);
    }
}
