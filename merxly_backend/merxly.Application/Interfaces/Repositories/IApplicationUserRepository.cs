using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IApplicationUserRepository : IGenericRepository<ApplicationUser, string>
    {
        Task<int> GetTotalOrdersCountAsync(string userId, CancellationToken cancellationToken = default);
        Task<int> GetPendingOrdersCountAsync(string userId, CancellationToken cancellationToken = default);
        Task<int> GetCompletedOrdersCountAsync(string userId, CancellationToken cancellationToken = default);
    }
}
