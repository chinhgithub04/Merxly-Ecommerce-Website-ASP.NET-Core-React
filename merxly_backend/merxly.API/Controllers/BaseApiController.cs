using merxly.Application.DTOs.Common;
using merxly.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace merxly.API.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        protected string GetUserIdFromClaims()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token claims");
            }

            return userId;
        }

        protected async Task<Guid?> GetStoreIdForCurrentUserAsync(
            IStoreRepository storeRepo,
            CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            return await storeRepo.GetStoreIdByOwnerIdAsync(userId, cancellationToken);
        }

        protected ActionResult<ResponseDto<T>> ForbiddenResponse<T>(string message = "You don't have permission to access this resource")
        {
            return StatusCode(403, new ResponseDto<T>
            {
                Data = default,
                IsSuccess = false,
                Message = message,
                StatusCode = 403,
                Errors = null
            });
        }

        protected ActionResult<ResponseDto<T>> NotFoundResponse<T>(string message = "Resource not found")
        {
            return NotFound(new ResponseDto<T>
            {
                Data = default,
                IsSuccess = false,
                Message = message,
                StatusCode = 404,
                Errors = null
            });
        }

        protected ActionResult<ResponseDto<T>> BadRequestResponse<T>(string message, List<string> errors = null)
        {
            return BadRequest(new ResponseDto<T>
            {
                Data = default,
                IsSuccess = false,
                Message = message,
                StatusCode = 400,
                Errors = errors ?? new List<string>()
            });
        }

        protected ActionResult<ResponseDto<T>> OkResponse<T>(T data, string message = "Success")
        {
            return Ok(new ResponseDto<T>
            {
                Data = data,
                IsSuccess = true,
                Message = message,
                StatusCode = 200,
                Errors = null
            });
        }
    }
}
