using merxly.Application.DTOs.CustomerAddress;

namespace merxly.Application.Interfaces.Services
{
    public interface ICustomerAddressService
    {
        Task<List<CustomerAddressDto>> GetCustomerAddressesAsync(string userId, CancellationToken cancellationToken = default);
        Task<CustomerAddressDto> GetCustomerAddressByIdAsync(string userId, Guid addressId, CancellationToken cancellationToken = default);
        Task<CustomerAddressDto> CreateCustomerAddressAsync(string userId, CreateCustomerAddressDto dto, CancellationToken cancellationToken = default);
        Task<CustomerAddressDto> UpdateCustomerAddressAsync(string userId, Guid addressId, UpdateCustomerAddressDto dto, CancellationToken cancellationToken = default);
        Task DeleteCustomerAddressAsync(string userId, Guid addressId, CancellationToken cancellationToken = default);
    }
}
