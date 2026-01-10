using AutoMapper;
using merxly.Application.DTOs.Store;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Constants;
using merxly.Domain.Entities;
using merxly.Domain.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class StoreService : IStoreService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly ILogger<StoreService> _logger;

        public StoreService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IMapper mapper,
            ILogger<StoreService> logger)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<DetailStoreDto> CreateStoreAsync(CreateStoreDto createStoreDto, string userId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Creating store for user: {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || !user.IsActive)
            {
                _logger.LogWarning("User not found or inactive: {UserId}", userId);
                throw new NotFoundException("User not found.");
            }

            var existingStore = await _unitOfWork.Store.GetFirstOrDefaultAsync(
                s => s.OwnerId == userId,
                cancellationToken);

            if (existingStore != null)
            {
                _logger.LogWarning("User {UserId} already has a store", userId);
                throw new InvalidOperationException("You already have a store.");
            }

            var store = _mapper.Map<Store>(createStoreDto);
            store.OwnerId = userId;
            store.IsActive = false;
            store.IsVerified = false;
            store.CommissionRate = 0.10m;

            await _unitOfWork.Store.AddAsync(store, cancellationToken);

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains(UserRoles.StoreOwner))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.StoreOwner);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Store created successfully: {StoreId} for user: {UserId}", store.Id, userId);

            var detailStoreDto = _mapper.Map<DetailStoreDto>(store);
            return detailStoreDto;
        }

        public async Task<DetailStoreDto> GetStoreByIdAsync(string userId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Retrieving store for user: {UserId}", userId);

            var store = await _unitOfWork.Store.GetFirstOrDefaultAsync(
                s => s.OwnerId == userId,
                cancellationToken,
                s => s.Owner);

            if (store == null)
            {
                _logger.LogInformation("No store found for user: {UserId}", userId);
                throw new NotFoundException("Store not found.");
            }

            var detailStoreDto = _mapper.Map<DetailStoreDto>(store);
            return detailStoreDto;
        }

        public async Task<DetailStoreDto> UpdateStoreAsync(UpdateStoreDto updateStoreDto, string userId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Updating store for user: {UserId}", userId);

            var store = await _unitOfWork.Store.GetFirstOrDefaultAsync(
                s => s.OwnerId == userId,
                cancellationToken,
                s => s.Owner);

            if (store == null)
            {
                _logger.LogWarning("No store found for user: {UserId}", userId);
                throw new NotFoundException("Store not found.");
            }

            _mapper.Map(updateStoreDto, store);

            _unitOfWork.Store.Update(store);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Store updated successfully: {StoreId} for user: {UserId}", store.Id, userId);

            var detailStoreDto = _mapper.Map<DetailStoreDto>(store);
            return detailStoreDto;
        }

        public async Task<List<StoreListItemDto>> GetAllStoresAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Retrieving all stores for admin");

            var stores = await _unitOfWork.Store.GetAllAsync(cancellationToken);

            var storeListItemDtos = _mapper.Map<List<StoreListItemDto>>(stores);

            _logger.LogInformation("Retrieved {Count} stores", storeListItemDtos.Count);

            return storeListItemDtos;
        }

        public async Task<AdminStoreDetailDto> GetStoreDetailForAdminAsync(Guid storeId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Retrieving store detail for admin: {StoreId}", storeId);

            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);

            if (store == null)
            {
                _logger.LogWarning("Store not found: {StoreId}", storeId);
                throw new NotFoundException("Store not found.");
            }

            var adminStoreDetailDto = _mapper.Map<AdminStoreDetailDto>(store);
            return adminStoreDetailDto;
        }

        public async Task<AdminStoreDetailDto> ApproveStoreAsync(Guid storeId, ApproveStoreDto approveStoreDto, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Approving store: {StoreId}", storeId);

            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);

            if (store == null)
            {
                _logger.LogWarning("Store not found: {StoreId}", storeId);
                throw new NotFoundException("Store not found.");
            }

            if (store.IsVerified)
            {
                _logger.LogWarning("Store already approved: {StoreId}", storeId);
                throw new InvalidOperationException("Store is already approved.");
            }

            store.IsVerified = true;
            store.RejectionReason = null;

            if (approveStoreDto.CommissionRate.HasValue)
            {
                store.CommissionRate = approveStoreDto.CommissionRate.Value;
            }

            _unitOfWork.Store.Update(store);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Store approved successfully: {StoreId}", storeId);

            var adminStoreDetailDto = _mapper.Map<AdminStoreDetailDto>(store);
            return adminStoreDetailDto;
        }

        public async Task<AdminStoreDetailDto> RejectStoreAsync(Guid storeId, RejectStoreDto rejectStoreDto, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Rejecting store: {StoreId}", storeId);

            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);

            if (store == null)
            {
                _logger.LogWarning("Store not found: {StoreId}", storeId);
                throw new NotFoundException("Store not found.");
            }

            if (store.IsVerified)
            {
                _logger.LogWarning("Cannot reject approved store: {StoreId}", storeId);
                throw new InvalidOperationException("Cannot reject an approved store.");
            }

            store.IsVerified = false;
            store.RejectionReason = rejectStoreDto.RejectionReason;

            _unitOfWork.Store.Update(store);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Store rejected successfully: {StoreId}, Reason: {Reason}", storeId, rejectStoreDto.RejectionReason);

            var adminStoreDetailDto = _mapper.Map<AdminStoreDetailDto>(store);
            return adminStoreDetailDto;
        }
    }
}
