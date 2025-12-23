using merxly.Application.DTOs.Auth;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : BaseApiController
    {
        private readonly IProductService _productService;
        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("top-10-featured")]
        public async Task<ActionResult<ResponseDto<IEnumerable<ProductDto>>>> GetTop10FeaturedProducts([FromQuery] Guid? categoryId, CancellationToken cancellationToken)
        {
            var result = await _productService.GetTop10FeaturedProductsAsync(categoryId, cancellationToken);

            return OkResponse(result, "Top 10 featured products retrieved successfully.");
        }
    }
}
