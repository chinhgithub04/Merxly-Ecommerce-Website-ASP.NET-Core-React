using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Wishlist;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WishlistController : BaseApiController
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpGet]
        public async Task<ActionResult<ResponseDto<WishlistDto>>> GetWishlist(CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            var result = await _wishlistService.GetWishlistAsync(userId, cancellationToken);
            return OkResponse(result, "Wishlist retrieved successfully");
        }

        [HttpPost("items")]
        public async Task<ActionResult<ResponseDto<WishlistDto>>> AddToWishlist([FromBody] AddToWishlistDto dto, CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            var result = await _wishlistService.AddToWishlistAsync(userId, dto, cancellationToken);
            return OkResponse(result, "Item added to wishlist successfully");
        }

        [HttpDelete("items/{id}")]
        public async Task<ActionResult> RemoveWishlistItem(Guid id, CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            await _wishlistService.RemoveWishlistItemAsync(userId, id, cancellationToken);
            return NoContent();
        }

        [HttpDelete]
        public async Task<ActionResult> ClearWishlist(CancellationToken cancellationToken = default)
        {
            var userId = GetUserIdFromClaims();
            await _wishlistService.ClearWishlistAsync(userId, cancellationToken);
            return NoContent();
        }
    }
}
