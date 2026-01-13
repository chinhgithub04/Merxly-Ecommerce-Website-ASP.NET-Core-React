using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.StoreTransfer;
using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IStoreTransferRepository : IGenericRepository<StoreTransfer, Guid>
    {
        Task<List<StoreTransfer>> GetByPaymentIdAsync(Guid paymentId, CancellationToken cancellationToken = default);
        Task<List<StoreTransfer>> GetByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default);
        Task<List<StoreTransfer>> GetBySubOrderIdAsync(Guid subOrderId, CancellationToken cancellationToken = default);
        Task AddRangeAsync(List<StoreTransfer> transfers, CancellationToken cancellationToken = default);
        Task<PaginatedResultDto<StoreTransfer>> GetStoreTransactionsAsync(Guid storeId, StoreTransferFilterDto filter, CancellationToken cancellationToken = default);
        Task<StoreTransfer?> GetStoreTransactionByIdAsync(Guid storeId, Guid transferId, CancellationToken cancellationToken = default);
    }
}
