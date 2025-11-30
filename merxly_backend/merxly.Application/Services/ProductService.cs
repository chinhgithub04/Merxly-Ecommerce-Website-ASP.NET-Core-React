using AutoMapper;
using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.Product;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Entities;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductService> _logger;

        public ProductService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<ProductService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PaginatedResultDto<ProductDto>> GetProductsAsync(
            ProductQueryParameters parameters,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Retrieving products. PageNumber: {PageNumber}, PageSize: {PageSize}", parameters.PageNumber, parameters.PageSize);

            var paginatedProducts = await _unitOfWork.Product.GetPaginatedProductsWithQueryParametersAsync(parameters, cancellationToken);

            var paginatedResult = _mapper.Map<PaginatedResultDto<ProductDto>>(paginatedProducts);

            _logger.LogInformation("Products retrieved successfully. PageNumber: {PageNumber}, PageSize: {PageSize}", parameters.PageNumber, parameters.PageSize);

            return paginatedResult;
        }

        public async Task<DetailProductDto> GetProductByIdAsync(Guid productId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Getting product by ID: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetFirstOrDefaultAsync(
                p => p.Id == productId && p.IsActive,
                cancellationToken,
                p => p.Category,
                p => p.Store,
                p => p.Variants);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            _logger.LogInformation("Product retrieved successfully: {ProductId}", productId);

            return _mapper.Map<DetailProductDto>(product);
        }

        public async Task<DetailProductDto> CreateProductAsync(
            CreateProductDto createProductDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Creating product for store: {StoreId}", storeId);

            var store = await _unitOfWork.Store.GetByIdAsync(storeId, cancellationToken);

            if (store == null)
            {
                _logger.LogWarning("Store not found: {StoreId}", storeId);
                throw new NotFoundException("Store not found.");
            }

            // Verify category exists
            var categoryExists = await _unitOfWork.Category.AnyAsync(
                c => c.Id == createProductDto.CategoryId,
                cancellationToken);

            if (!categoryExists)
            {
                _logger.LogWarning("Category not found: {CategoryId}", createProductDto.CategoryId);
                throw new NotFoundException("Category not found.");
            }

            var product = _mapper.Map<Product>(createProductDto);
            product.StoreId = store.Id;
            product.IsActive = true;
            product.IsPlatformFeatured = false;
            product.TotalStock = 0;
            product.AverageRating = 0;
            product.ReviewCount = 0;
            product.TotalSold = 0;

            await _unitOfWork.Product.AddAsync(product, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product created successfully: {ProductId}", product.Id);

            // Reload with navigation properties
            var createdProduct = await _unitOfWork.Product.GetProductDetailsByIdAsync(
                product.Id,
                cancellationToken);

            return _mapper.Map<DetailProductDto>(createdProduct);
        }

        public async Task<DetailProductDto> UpdateProductAsync(
            Guid productId,
            UpdateProductDto updateProductDto,
            Guid storeId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Updating product: {ProductId} by store: {StoreId}", productId, storeId);

            var product = await _unitOfWork.Product.GetByIdAsync(
                productId,
                cancellationToken,
                p => p.Store);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.Store.Id != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to update this product.");
            }

            // Verify category if being updated
            if (updateProductDto.CategoryId.HasValue)
            {
                var categoryExists = await _unitOfWork.Category.AnyAsync(
                    c => c.Id == updateProductDto.CategoryId.Value,
                    cancellationToken);

                if (!categoryExists)
                {
                    _logger.LogWarning("Category not found: {CategoryId}", updateProductDto.CategoryId);
                    throw new NotFoundException("Category not found.");
                }
            }

            _mapper.Map(updateProductDto, product);
            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product updated successfully: {ProductId}", productId);

            // Reload with navigation properties
            var updatedProduct = await _unitOfWork.Product.GetProductDetailsByIdAsync(
                product.Id,
                cancellationToken);

            return _mapper.Map<DetailProductDto>(updatedProduct);
        }


        public async Task<DetailProductDto> ToggleProductPlatformFeaturedAsync(Guid productId, ToggleProductPlatformFeaturedDto toggleDto, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Toggling platform featured status for product: {ProductId}", productId);

            var product = await _unitOfWork.Product.GetByIdAsync(
                productId,
                cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            if (product.IsPlatformFeatured != toggleDto.IsPlatformFeatured)
            {
                _mapper.Map(toggleDto, product);
            }

            _unitOfWork.Product.Update(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product platform featured status updated successfully: {ProductId}", productId);

            // Reload with navigation properties
            var updatedProduct = await _unitOfWork.Product.GetProductDetailsByIdAsync(
                product.Id,
                cancellationToken);

            return _mapper.Map<DetailProductDto>(updatedProduct);
        }

        public async Task DeleteProductAsync(Guid productId, Guid storeId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Deleting product: {ProductId} by store: {StoreId}", productId, storeId);

            var product = await _unitOfWork.Product.GetByIdAsync(
                productId,
                cancellationToken,
                p => p.Store);

            if (product == null)
            {
                _logger.LogWarning("Product not found: {ProductId}", productId);
                throw new NotFoundException("Product not found.");
            }

            // Verify ownership
            if (product.Store.Id != storeId)
            {
                _logger.LogWarning("Store {StoreId} is not the owner of product {ProductId}", storeId, productId);
                throw new ForbiddenAccessException("You don't have permission to delete this product.");
            }

            _unitOfWork.Product.Remove(product);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Product deleted successfully: {ProductId}", productId);
        }
    }
}
