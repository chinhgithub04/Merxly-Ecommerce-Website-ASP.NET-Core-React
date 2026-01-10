using merxly.Application.DTOs.StoreAddress;

namespace merxly.Application.Interfaces.Services
{
    public interface IStoreAddressService
    {
        Task<StoreAddressDto> GetStoreAddressAsync(Guid storeId, CancellationToken cancellationToken = default);
        Task<StoreAddressDto> CreateStoreAddressAsync(Guid storeId, CreateStoreAddressDto dto, CancellationToken cancellationToken = default);
        Task<StoreAddressDto> UpdateStoreAddressAsync(Guid storeId, UpdateStoreAddressDto dto, CancellationToken cancellationToken = default);
    }
}
