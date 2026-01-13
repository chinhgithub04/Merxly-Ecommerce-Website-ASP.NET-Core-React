using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.StoreTransfer;

namespace merxly.Application.Interfaces.Services
{
    public interface IStoreTransactionService
    {
        Task<PaginatedResultDto<StoreTransferDto>> GetStoreTransactionsAsync(Guid storeId, StoreTransferFilterDto filter, CancellationToken cancellationToken = default);
        Task<StoreTransferDetailDto> GetStoreTransactionByIdAsync(Guid storeId, Guid transferId, CancellationToken cancellationToken = default);
    }
}
