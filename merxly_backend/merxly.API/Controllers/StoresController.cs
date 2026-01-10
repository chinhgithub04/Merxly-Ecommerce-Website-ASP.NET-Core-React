using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Store;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StoresController : BaseApiController
    {
        private readonly IStoreService _storeService;

        public StoresController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<DetailStoreDto>>> CreateStore([FromBody] CreateStoreDto dto, CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            var detailStoreDto = await _storeService.CreateStoreAsync(dto, userId, cancellationToken);

            var response = new ResponseDto<DetailStoreDto>
            {
                Data = detailStoreDto,
                IsSuccess = true,
                Message = "Store created successfully",
                StatusCode = 201,
            };

            return CreatedAtAction(nameof(GetStoreById), new { id = detailStoreDto.Id }, response);
        }

        [HttpGet("my-store")]
        public async Task<ActionResult<ResponseDto<DetailStoreDto>>> GetStoreById(CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            var result = await _storeService.GetStoreByIdAsync(userId, cancellationToken);

            return OkResponse(result, "Store retrieved successfully");
        }

        [HttpPatch("my-store")]
        public async Task<ActionResult<ResponseDto<DetailStoreDto>>> UpdateStore([FromBody] UpdateStoreDto dto, CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            var result = await _storeService.UpdateStoreAsync(dto, userId, cancellationToken);

            return OkResponse(result, "Store updated successfully");
        }

        // Admin-only endpoints
        [HttpGet("admin/all")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<ResponseDto<List<StoreListItemDto>>>> GetAllStores(CancellationToken cancellationToken = default)
        {
            var result = await _storeService.GetAllStoresAsync(cancellationToken);

            return OkResponse(result, "Stores retrieved successfully");
        }

        [HttpGet("admin/{storeId}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<ResponseDto<AdminStoreDetailDto>>> GetStoreDetailForAdmin(Guid storeId, CancellationToken cancellationToken = default)
        {
            var result = await _storeService.GetStoreDetailForAdminAsync(storeId, cancellationToken);

            return OkResponse(result, "Store detail retrieved successfully");
        }

        [HttpPost("admin/{storeId}/approve")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<ResponseDto<AdminStoreDetailDto>>> ApproveStore(Guid storeId, [FromBody] ApproveStoreDto dto, CancellationToken cancellationToken = default)
        {
            var result = await _storeService.ApproveStoreAsync(storeId, dto, cancellationToken);

            return OkResponse(result, "Store approved successfully");
        }

        [HttpPost("admin/{storeId}/reject")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<ActionResult<ResponseDto<AdminStoreDetailDto>>> RejectStore(Guid storeId, [FromBody] RejectStoreDto dto, CancellationToken cancellationToken = default)
        {
            var result = await _storeService.RejectStoreAsync(storeId, dto, cancellationToken);

            return OkResponse(result, "Store rejected successfully");
        }
    }
}
