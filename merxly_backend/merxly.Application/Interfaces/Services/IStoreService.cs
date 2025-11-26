using merxly.Application.DTOs.Store;

namespace merxly.Application.Interfaces.Services
{
    public interface IStoreService
    {
        Task<DetailStoreDto> CreateStoreAsync(CreateStoreDto createStoreDto, string userId, CancellationToken cancellationToken);
        Task<DetailStoreDto> GetStoreByIdAsync(string userId, CancellationToken cancellationToken);
    }
}
