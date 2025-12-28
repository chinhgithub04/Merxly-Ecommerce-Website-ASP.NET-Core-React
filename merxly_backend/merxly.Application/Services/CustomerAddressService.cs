using AutoMapper;
using merxly.Application.DTOs.CustomerAddress;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class CustomerAddressService : ICustomerAddressService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<CustomerAddressService> _logger;

        public CustomerAddressService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<CustomerAddressService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<List<CustomerAddressDto>> GetCustomerAddressesAsync(string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving addresses for user: {UserId}", userId);

            var addresses = await _unitOfWork.Address.GetAddressesByUserIdAsync(userId, cancellationToken);
            var addressDtos = _mapper.Map<List<CustomerAddressDto>>(addresses);

            _logger.LogInformation("Successfully retrieved {Count} addresses for user: {UserId}", addressDtos.Count, userId);
            return addressDtos;
        }

        public async Task<CustomerAddressDto> GetCustomerAddressByIdAsync(string userId, Guid addressId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving address {AddressId} for user: {UserId}", addressId, userId);

            var address = await _unitOfWork.Address.GetAddressByIdAndUserIdAsync(addressId, userId, cancellationToken);
            if (address == null)
            {
                _logger.LogWarning("Address {AddressId} not found for user: {UserId}", addressId, userId);
                throw new NotFoundException($"Address with ID {addressId} not found");
            }

            var addressDto = _mapper.Map<CustomerAddressDto>(address);
            _logger.LogInformation("Successfully retrieved address {AddressId} for user: {UserId}", addressId, userId);
            return addressDto;
        }

        public async Task<CustomerAddressDto> CreateCustomerAddressAsync(string userId, CreateCustomerAddressDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating new address for user: {UserId}", userId);

            // If this address is marked as default, unset all other default addresses
            if (dto.IsDefault)
            {
                await _unitOfWork.Address.UnsetAllDefaultAddressesAsync(userId, cancellationToken);
            }
            else
            {
                // If user has no addresses yet, make this the default
                var hasAddresses = await _unitOfWork.Address.HasDefaultAddressAsync(userId, cancellationToken);
                if (!hasAddresses)
                {
                    dto.IsDefault = true;
                }
            }

            var address = _mapper.Map<Address>(dto);
            address.UserId = userId;

            await _unitOfWork.Address.AddAsync(address, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created address {AddressId} for user: {UserId}", address.Id, userId);

            var addressDto = _mapper.Map<CustomerAddressDto>(address);
            return addressDto;
        }

        public async Task<CustomerAddressDto> UpdateCustomerAddressAsync(string userId, Guid addressId, UpdateCustomerAddressDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Updating address {AddressId} for user: {UserId}", addressId, userId);

            var address = await _unitOfWork.Address.GetAddressByIdAndUserIdAsync(addressId, userId, cancellationToken);
            if (address == null)
            {
                _logger.LogWarning("Address {AddressId} not found for user: {UserId}", addressId, userId);
                throw new NotFoundException($"Address with ID {addressId} not found");
            }

            // If setting this address as default, unset all other default addresses
            if (dto.IsDefault.HasValue && dto.IsDefault.Value && !address.IsDefault)
            {
                await _unitOfWork.Address.UnsetAllDefaultAddressesAsync(userId, cancellationToken);
            }

            // Apply updates using AutoMapper
            _mapper.Map(dto, address);

            _unitOfWork.Address.Update(address);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated address {AddressId} for user: {UserId}", addressId, userId);

            var addressDto = _mapper.Map<CustomerAddressDto>(address);
            return addressDto;
        }

        public async Task DeleteCustomerAddressAsync(string userId, Guid addressId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Deleting address {AddressId} for user: {UserId}", addressId, userId);

            var address = await _unitOfWork.Address.GetAddressByIdAndUserIdAsync(addressId, userId, cancellationToken);
            if (address == null)
            {
                _logger.LogWarning("Address {AddressId} not found for user: {UserId}", addressId, userId);
                throw new NotFoundException($"Address with ID {addressId} not found");
            }

            var wasDefault = address.IsDefault;

            _unitOfWork.Address.Remove(address);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // If the deleted address was default, set another address as default
            if (wasDefault)
            {
                var addresses = await _unitOfWork.Address.GetAddressesByUserIdAsync(userId, cancellationToken);
                if (addresses.Any())
                {
                    var newDefault = addresses.First();
                    newDefault.IsDefault = true;
                    _unitOfWork.Address.Update(newDefault);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Set address {NewDefaultId} as new default for user: {UserId}", newDefault.Id, userId);
                }
            }

            _logger.LogInformation("Successfully deleted address {AddressId} for user: {UserId}", addressId, userId);
        }
    }
}
