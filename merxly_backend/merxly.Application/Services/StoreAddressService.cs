using AutoMapper;
using merxly.Application.DTOs.StoreAddress;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class StoreAddressService : IStoreAddressService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<StoreAddressService> _logger;

        public StoreAddressService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<StoreAddressService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<StoreAddressDto> GetStoreAddressAsync(Guid storeId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving address for store: {StoreId}", storeId);

            // Verify store exists
            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);
            if (store == null)
            {
                _logger.LogWarning("Store {StoreId} not found", storeId);
                throw new NotFoundException($"Store with ID {storeId} not found");
            }

            var storeAddress = await _unitOfWork.StoreAddress.GetByStoreIdAsync(storeId, cancellationToken);

            if (storeAddress == null)
            {
                _logger.LogInformation("No address found for store: {StoreId}", storeId);
                throw new NotFoundException($"Store does not have an address.");
            }

            var addressDto = _mapper.Map<StoreAddressDto>(storeAddress);
            _logger.LogInformation("Successfully retrieved address for store: {StoreId}", storeId);
            return addressDto;
        }

        public async Task<StoreAddressDto> CreateStoreAddressAsync(Guid storeId, CreateStoreAddressDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating address for store: {StoreId}", storeId);

            // Verify store exists
            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);
            if (store == null)
            {
                _logger.LogWarning("Store {StoreId} not found", storeId);
                throw new NotFoundException($"Store with ID {storeId} not found");
            }

            // Check if store already has an address
            var existingAddress = await _unitOfWork.StoreAddress.GetByStoreIdAsync(storeId, cancellationToken);
            if (existingAddress != null)
            {
                _logger.LogWarning("Store {StoreId} already has an address", storeId);
                throw new InvalidOperationException($"Store already has an address. Use update endpoint to modify it.");
            }

            var storeAddress = _mapper.Map<StoreAddress>(dto);
            storeAddress.StoreId = storeId;

            await _unitOfWork.StoreAddress.AddAsync(storeAddress, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created address {AddressId} for store: {StoreId}", storeAddress.Id, storeId);

            var addressDto = _mapper.Map<StoreAddressDto>(storeAddress);
            return addressDto;
        }

        public async Task<StoreAddressDto> UpdateStoreAddressAsync(Guid storeId, UpdateStoreAddressDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Updating address for store: {StoreId}", storeId);

            // Verify store exists
            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);
            if (store == null)
            {
                _logger.LogWarning("Store {StoreId} not found", storeId);
                throw new NotFoundException($"Store with ID {storeId} not found");
            }

            var storeAddress = await _unitOfWork.StoreAddress.GetByStoreIdAsync(storeId, cancellationToken);
            if (storeAddress == null)
            {
                _logger.LogWarning("No address found for store: {StoreId}", storeId);
                throw new NotFoundException($"Store does not have an address. Use create endpoint to add one.");
            }

            _mapper.Map(dto, storeAddress);

            _unitOfWork.StoreAddress.Update(storeAddress);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated address for store: {StoreId}", storeId);

            var addressDto = _mapper.Map<StoreAddressDto>(storeAddress);
            return addressDto;
        }
    }
}
