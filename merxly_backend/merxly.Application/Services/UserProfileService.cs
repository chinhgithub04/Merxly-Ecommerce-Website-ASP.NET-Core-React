using AutoMapper;
using merxly.Application.DTOs.UserProfile;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class UserProfileService : IUserProfileService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<UserProfileService> _logger;

        public UserProfileService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            ILogger<UserProfileService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<UserProfileDto> GetUserProfileAsync(string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting profile for user {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found", userId);
                throw new NotFoundException("User not found");
            }

            var totalOrders = await _unitOfWork.ApplicationUser.GetTotalOrdersCountAsync(userId, cancellationToken);
            var pendingOrders = await _unitOfWork.ApplicationUser.GetPendingOrdersCountAsync(userId, cancellationToken);
            var completedOrders = await _unitOfWork.ApplicationUser.GetCompletedOrdersCountAsync(userId, cancellationToken);

            var profileDto = _mapper.Map<UserProfileDto>(user);

            profileDto = profileDto with
            {
                TotalOrders = totalOrders,
                PendingOrders = pendingOrders,
                CompletedOrders = completedOrders
            };

            _logger.LogInformation("Successfully retrieved profile for user {UserId}", userId);
            return profileDto;
        }

        public async Task<UserProfileDto> UpdateUserProfileAsync(string userId, UpdateUserProfileDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Updating profile for user {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found", userId);
                throw new NotFoundException("User not found");
            }

            // Update email if changed
            if (dto.Email != user.Email)
            {
                var existingUser = await _userManager.FindByEmailAsync(dto.Email);
                if (existingUser != null && existingUser.Id != userId)
                {
                    _logger.LogWarning("Email {Email} is already taken by another user", dto.Email);
                    throw new BadRequestException("Email is already taken");
                }

                var setEmailResult = await _userManager.SetEmailAsync(user, dto.Email);
                if (!setEmailResult.Succeeded)
                {
                    _logger.LogError("Failed to update email for user {UserId}: {Errors}",
                        userId, string.Join(", ", setEmailResult.Errors.Select(e => e.Description)));
                    throw new BadRequestException("Failed to update email");
                }
            }

            var updatedUser = _mapper.Map(dto, user);

            // Update other properties
            var updateResult = await _userManager.UpdateAsync(updatedUser);
            if (!updateResult.Succeeded)
            {
                _logger.LogError("Failed to update profile for user {UserId}: {Errors}",
                    userId, string.Join(", ", updateResult.Errors.Select(e => e.Description)));
                throw new BadRequestException("Failed to update profile");
            }

            _logger.LogInformation("Successfully updated profile for user {UserId}", userId);

            // Return updated profile
            return await GetUserProfileAsync(userId, cancellationToken);
        }

        public async Task ChangePasswordAsync(string userId, ChangePasswordDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Changing password for user {UserId}", userId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found", userId);
                throw new NotFoundException("User not found");
            }

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogWarning("Failed to change password for user {UserId}: {Errors}", userId, errors);
                throw new BadRequestException($"Failed to change password: {errors}");
            }

            _logger.LogInformation("Successfully changed password for user {UserId}", userId);
        }
    }
}
