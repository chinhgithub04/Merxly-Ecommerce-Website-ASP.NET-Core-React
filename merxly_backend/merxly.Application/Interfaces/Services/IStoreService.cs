using merxly.Application.DTOs.Store;

namespace merxly.Application.Interfaces.Services
{
    public interface IStoreService
    {
        Task<DetailStoreDto> CreateStoreAsync(CreateStoreDto createStoreDto, string userId, CancellationToken cancellationToken);
        Task<DetailStoreDto> GetStoreByIdAsync(string userId, CancellationToken cancellationToken);
        Task<DetailStoreDto> UpdateStoreAsync(UpdateStoreDto updateStoreDto, string userId, CancellationToken cancellationToken);

        // Admin methods
        Task<List<StoreListItemDto>> GetAllStoresAsync(CancellationToken cancellationToken);
        Task<AdminStoreDetailDto> GetStoreDetailForAdminAsync(Guid storeId, CancellationToken cancellationToken);
        Task<AdminStoreDetailDto> ApproveStoreAsync(Guid storeId, ApproveStoreDto approveStoreDto, CancellationToken cancellationToken);
        Task<AdminStoreDetailDto> RejectStoreAsync(Guid storeId, RejectStoreDto rejectStoreDto, CancellationToken cancellationToken);
    }
}
