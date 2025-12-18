using merxly.Application.DTOs.Category;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.DTOs.Product.Update;
using merxly.Application.DTOs.ProductAttribute;
using merxly.Application.DTOs.ProductAttribute.Delete;
using merxly.Application.DTOs.ProductAttribute.Update;
using merxly.Application.DTOs.ProductAttributeValue;
using merxly.Application.DTOs.ProductAttributeValue.Delete;
using merxly.Application.DTOs.ProductAttributeValue.Update;
using merxly.Application.DTOs.ProductVariant.Delete;
using merxly.Application.DTOs.ProductVariant.Update;
using merxly.Application.DTOs.ProductVariantMedia.Update;
using merxly.Application.Interfaces.Repositories;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRoles.StoreOwner)]

    public class StoreProductsController : BaseApiController
    {
        private readonly IProductService _productService;
        private readonly IStoreRepository _storeRepository;
        public StoreProductsController(IProductService productService, IStoreRepository storeRepository)
        {
            _productService = productService;
            _storeRepository = storeRepository;
        }

        #region 1. Product CRUD (Basic)
        [HttpGet]
        public async Task<ActionResult<ResponseDto<PaginatedResultDto<ProductForStoreDto>>>> GetAllProducts([FromQuery] ProductQueryParametersForStore parameters, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.GetAllProductsForStoreAsync(storeId.Value, parameters, cancellationToken);

            return OkResponse(result, "Products retrieved successfully.");
        }

        [HttpGet("used-categories")]
        public async Task<ActionResult<ResponseDto<IEnumerable<CategoryForStoreDto>>>> GetUsedCategories(CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.GetUsedCategoriesByStoreIdAsync(storeId.Value, cancellationToken);

            return OkResponse(result, "Used categories retrieved successfully.");
        }

        [HttpPost]
        public async Task<ActionResult<ResponseDto<StoreDetailProductDto>>> CreateProduct([FromBody] CreateProductDto createProductDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.CreateProductAsync(createProductDto, storeId.Value, cancellationToken);

            var response = new ResponseDto<StoreDetailProductDto>
            {
                Data = result,
                IsSuccess = true,
                Message = "Product created successfully.",
                StatusCode = 201
            };

            return CreatedAtAction(nameof(GetProductById), new { productId = result.Id }, response);
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<ResponseDto<StoreDetailProductDto>>> GetProductById(Guid productId, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.GetProductByIdForStoreAsync(productId, storeId.Value, cancellationToken);

            return OkResponse(result, "Product detail retrieved successfully.");
        }

        [HttpPatch("{productId}/basic")]
        public async Task<ActionResult<ResponseDto<ResponseUpdateProductDto>>> UpdateProduct(Guid productId, [FromBody] UpdateProductDto updateProductDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.UpdateProductAsync(productId, updateProductDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product updated successfully.");
        }

        [HttpDelete("{productId}")]
        public async Task<ActionResult> DeleteProduct(Guid productId, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            await _productService.DeleteProductAsync(productId, storeId.Value, cancellationToken);

            return NoContent();
        }
        #endregion

        #region 2. Product Attributes
        [HttpPost("{productId}/attributes")]
        public async Task<ActionResult<ResponseDto<AddAttributesWithVariantsResponseDto>>> AddAttributesAndRegenerateVariants(Guid productId, [FromBody] AddAttributeWithVariantsDto addAttributeWithVariantsDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.AddAttributesAndRegenerateVariantsAsync(productId, addAttributeWithVariantsDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product attributes added and variants regenerated successfully.");
        }

        [HttpPatch("{productId}/attributes")]
        public async Task<ActionResult<ResponseDto<BulkUpdateProductAttributesResponseDto>>> UpdateProductAttribute(Guid productId, [FromBody] BulkUpdateProductAttributesDto bulkUpdateProductAttributesDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.UpdateProductAttributeAsync(productId, bulkUpdateProductAttributesDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product attributes updated successfully.");
        }

        [HttpDelete("{productId}/attributes")]
        public async Task<ActionResult<ResponseDto<BulkDeleteAttributesResponseDto>>> DeleteAttributesAndRegenerateVariants(Guid productId, [FromBody] DeleteAttributesWithVariantsDto deleteAttributesWithVariantsDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.DeleteAttributesAndRegenerateVariantsAsync(productId, deleteAttributesWithVariantsDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product attributes deleted and variants regenerated successfully.");
        }
        #endregion

        #region 3. Product Attribute Values
        [HttpPost("{productId}/attribute-values")]
        public async Task<ActionResult<ResponseDto<AddAttributeValuesWithVariantsResponseDto>>> AddAttributeValuesAndRegenerateVariants(Guid productId, [FromBody] AddAttributeValuesAndVariants addAttributeValuesAndVariants, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.AddAttributeValuesAndRegenerateVariantsAsync(productId, addAttributeValuesAndVariants, storeId.Value, cancellationToken);

            return OkResponse(result, "Product attribute values added and variants regenerated successfully.");
        }

        [HttpPatch("attribute-values/{productAttributeId}")]
        public async Task<ActionResult<ResponseDto<BulkUpdateProductAttributeValuesResponseDto>>> UpdateProductAttributeValue(Guid productAttributeId, [FromBody] BulkUpdateProductAttributeValuesDto bulkUpdateProductAttributeValuesDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.UpdateProductAttributeValueAsync(productAttributeId, bulkUpdateProductAttributeValuesDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product attribute values updated successfully.");
        }

        [HttpDelete("{productId}/attribute-values")]
        public async Task<ActionResult<ResponseDto<BulkDeleteAttributeValuesResponseDto>>> DeleteAttributeValuesAndRegenerateVariants(Guid productId, [FromBody] DeleteAttributeValuesWithVariantsDto deleteAttributeValuesWithVariantsDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.DeleteAttributeValuesAndRegenerateVariantsAsync(productId, deleteAttributeValuesWithVariantsDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product attribute values deleted and variants regenerated successfully.");
        }
        #endregion

        #region 4. Product Variants
        [HttpPatch("{productId}/variants")]
        public async Task<ActionResult<ResponseDto<BulkUpdateProductVariantsResponseDto>>> UpdateProductVariant(Guid productId, [FromBody] BulkUpdateProductVariantsDto bulkUpdateProductVariantsDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.UpdateProductVariantAsync(productId, bulkUpdateProductVariantsDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product variants updated successfully.");
        }

        [HttpDelete("{productId}/variants")]
        public async Task<ActionResult<ResponseDto<BulkDeleteVariantsResponseDto>>> DeleteProductVariants(Guid productId, [FromBody] BulkDeleteVariantsDto bulkDeleteVariantsDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.DeleteProductVariantsAsync(productId, bulkDeleteVariantsDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product variants deleted successfully.");
        }
        #endregion

        #region 5. Product Media
        [HttpPatch("{productId}/media")]
        public async Task<ActionResult<ResponseDto<BulkUpdateProductMediaResponseDto>>> UpdateProductVariantMedia(Guid productId, [FromBody] BulkUpdateProductMediaRequestDto bulkUpdateProductMediaRequestDto, CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);
            var result = await _productService.UpdateProductVariantMediaAsync(productId, bulkUpdateProductMediaRequestDto, storeId.Value, cancellationToken);

            return OkResponse(result, "Product variant media updated successfully.");
        }
        #endregion
    }
}