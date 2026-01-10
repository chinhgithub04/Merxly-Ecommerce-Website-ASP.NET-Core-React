using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.StoreAddress;
using merxly.Application.Interfaces.Repositories;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/store/address")]
    [Authorize]
    public class StoreAddressesController : BaseApiController
    {
        private readonly IStoreAddressService _storeAddressService;
        private readonly IStoreRepository _storeRepository;

        public StoreAddressesController(
            IStoreAddressService storeAddressService,
            IStoreRepository storeRepository)
        {
            _storeAddressService = storeAddressService;
            _storeRepository = storeRepository;
        }

        /// <summary>
        /// Get address for the current user's store
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<StoreAddressDto>>> GetStoreAddress(CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);

            var address = await _storeAddressService.GetStoreAddressAsync(storeId.Value, cancellationToken);

            return OkResponse(address, "Store address retrieved successfully");
        }

        /// <summary>
        /// Create address for the current user's store
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ResponseDto<StoreAddressDto>>> CreateStoreAddress(
            [FromBody] CreateStoreAddressDto dto,
            CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);

            var address = await _storeAddressService.CreateStoreAddressAsync(storeId.Value, dto, cancellationToken);

            return OkResponse(address, "Store address created successfully");
        }

        /// <summary>
        /// Update address for the current user's store
        /// </summary>
        [HttpPatch]
        public async Task<ActionResult<ResponseDto<StoreAddressDto>>> UpdateStoreAddress(
            [FromBody] UpdateStoreAddressDto dto,
            CancellationToken cancellationToken)
        {
            var storeId = await GetStoreIdForCurrentUserAsync(_storeRepository, cancellationToken);

            var address = await _storeAddressService.UpdateStoreAddressAsync(storeId.Value, dto, cancellationToken);

            return OkResponse(address, "Store address updated successfully");
        }
    }
}
