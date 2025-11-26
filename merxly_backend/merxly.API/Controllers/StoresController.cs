using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Store;
using merxly.Application.Interfaces.Services;
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
    }
}
