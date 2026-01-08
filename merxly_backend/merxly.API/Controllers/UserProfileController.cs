using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.UserProfile;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRoles.Customer)]
    public class UserProfileController : BaseApiController
    {
        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        /// <summary>
        /// Get current user's profile information
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<UserProfileDto>>> GetUserProfile(
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var result = await _userProfileService.GetUserProfileAsync(userId, cancellationToken);
            return OkResponse(result, "Profile retrieved successfully");
        }

        /// <summary>
        /// Update current user's profile information
        /// </summary>
        [HttpPut]
        public async Task<ActionResult<ResponseDto<UserProfileDto>>> UpdateUserProfile(
            [FromBody] UpdateUserProfileDto dto,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var result = await _userProfileService.UpdateUserProfileAsync(userId, dto, cancellationToken);
            return OkResponse(result, "Profile updated successfully");
        }

        /// <summary>
        /// Change current user's password
        /// </summary>
        [HttpPost("change-password")]
        public async Task<ActionResult<ResponseDto<object>>> ChangePassword(
            [FromBody] ChangePasswordDto dto,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            await _userProfileService.ChangePasswordAsync(userId, dto, cancellationToken);
            return OkResponse<object>(null, "Password changed successfully");
        }
    }
}
