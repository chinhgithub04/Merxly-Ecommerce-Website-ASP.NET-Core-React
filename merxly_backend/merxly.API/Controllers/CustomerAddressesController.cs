using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.CustomerAddress;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/customer/addresses")]
    [Authorize]
    public class CustomerAddressesController : BaseApiController
    {
        private readonly ICustomerAddressService _customerAddressService;

        public CustomerAddressesController(ICustomerAddressService customerAddressService)
        {
            _customerAddressService = customerAddressService;
        }

        /// <summary>
        /// Get all addresses for the current customer
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<List<CustomerAddressDto>>>> GetAddresses(CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var addresses = await _customerAddressService.GetCustomerAddressesAsync(userId, cancellationToken);

            return OkResponse(addresses, "Addresses retrieved successfully");
        }

        /// <summary>
        /// Get address detail by id
        /// </summary>
        [HttpGet("{addressId}")]
        public async Task<ActionResult<ResponseDto<CustomerAddressDto>>> GetAddressById(
            Guid addressId,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var address = await _customerAddressService.GetCustomerAddressByIdAsync(userId, addressId, cancellationToken);

            return OkResponse(address, "Address retrieved successfully");
        }

        /// <summary>
        /// Create a new address
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ResponseDto<CustomerAddressDto>>> CreateAddress(
            [FromBody] CreateCustomerAddressDto dto,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var address = await _customerAddressService.CreateCustomerAddressAsync(userId, dto, cancellationToken);

            return OkResponse(address, "Address created successfully");
        }

        /// <summary>
        /// Update an existing address
        /// </summary>
        [HttpPatch("{addressId}")]
        public async Task<ActionResult<ResponseDto<CustomerAddressDto>>> UpdateAddress(
            Guid addressId,
            [FromBody] UpdateCustomerAddressDto dto,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var address = await _customerAddressService.UpdateCustomerAddressAsync(userId, addressId, dto, cancellationToken);

            return OkResponse(address, "Address updated successfully");
        }

        /// <summary>
        /// Delete an address
        /// </summary>
        [HttpDelete("{addressId}")]
        public async Task<ActionResult> DeleteAddress(
            Guid addressId,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            await _customerAddressService.DeleteCustomerAddressAsync(userId, addressId, cancellationToken);

            return NoContent();
        }
    }
}
