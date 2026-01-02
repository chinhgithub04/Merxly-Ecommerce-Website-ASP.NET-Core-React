using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.CustomerOrders;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/customer/orders")]
    [ApiController]
    [Authorize]
    public class CustomerOrdersController : BaseApiController
    {
        private readonly ICustomerOrderService _customerOrderService;

        public CustomerOrdersController(ICustomerOrderService customerOrderService)
        {
            _customerOrderService = customerOrderService;
        }

        /// <summary>
        /// Get paginated list of orders for the authenticated customer.
        /// Supports filtering by status, order numbers, and date range.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<PaginatedResultDto<CustomerSubOrderDto>>>> GetCustomerOrders(
            [FromQuery] CustomerSubOrderFilterDto filter,
            CancellationToken cancellationToken = default)
        {
            var customerId = GetUserIdFromClaims();

            var result = await _customerOrderService.GetCustomerOrdersAsync(customerId, filter, cancellationToken);
            return OkResponse(result, "Orders retrieved successfully");
        }

        /// <summary>
        /// Get detailed information about a specific sub-order.
        /// </summary>
        [HttpGet("{subOrderId}")]
        public async Task<ActionResult<ResponseDto<CustomerSubOrderDetailDto>>> GetCustomerOrderById(
            Guid subOrderId,
            CancellationToken cancellationToken = default)
        {
            var customerId = GetUserIdFromClaims();

            var result = await _customerOrderService.GetCustomerOrderByIdAsync(customerId, subOrderId, cancellationToken);
            return OkResponse(result, "Order retrieved successfully");
        }

        /// <summary>
        /// Update the status of a sub-order.
        /// Allowed transitions for customers:
        /// - Confirmed -> Cancelled (customer cancels order)
        /// - Shipped -> Completed (customer confirms receipt)
        /// </summary>
        [HttpPatch("{subOrderId}/status")]
        public async Task<ActionResult<ResponseDto<CustomerSubOrderDetailDto>>> UpdateCustomerSubOrderStatus(
            Guid subOrderId,
            [FromBody] UpdateCustomerSubOrderStatusDto dto,
            CancellationToken cancellationToken = default)
        {
            var customerId = GetUserIdFromClaims();

            var result = await _customerOrderService.UpdateCustomerSubOrderStatusAsync(customerId, subOrderId, dto, cancellationToken);
            return OkResponse(result, "Order status updated successfully");
        }
    }
}
