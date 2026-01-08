using merxly.Application.DTOs.UserProfile;

namespace merxly.Application.Interfaces.Services
{
    public interface IUserProfileService
    {
        Task<UserProfileDto> GetUserProfileAsync(string userId, CancellationToken cancellationToken = default);
        Task<UserProfileDto> UpdateUserProfileAsync(string userId, UpdateUserProfileDto dto, CancellationToken cancellationToken = default);
        Task ChangePasswordAsync(string userId, ChangePasswordDto dto, CancellationToken cancellationToken = default);
    }
}
