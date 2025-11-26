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
    }
}
