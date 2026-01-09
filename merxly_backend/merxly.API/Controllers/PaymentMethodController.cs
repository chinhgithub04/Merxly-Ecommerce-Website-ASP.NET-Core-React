using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.PaymentMethod;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/payment-methods")]
    [Authorize]
    public class PaymentMethodController : BaseApiController
    {
        private readonly IUserPaymentMethodService _paymentMethodService;

        public PaymentMethodController(
            IUserPaymentMethodService paymentMethodService)
        {
            _paymentMethodService = paymentMethodService;
        }

        /// <summary>
        /// Get all payment methods for the current user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ResponseDto<List<PaymentMethodDto>>>> GetPaymentMethods(CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var paymentMethods = await _paymentMethodService.GetUserPaymentMethodsAsync(userId, cancellationToken);

            return OkResponse(paymentMethods, "Payment methods retrieved successfully");
        }

        /// <summary>
        /// Create a setup intent for adding payment method
        /// </summary>
        [HttpPost("setup-intent")]
        public async Task<ActionResult<ResponseDto<string>>> CreateSetupIntent(CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var clientSecret = await _paymentMethodService.CreateSetupIntentAsync(userId, cancellationToken);

            return OkResponse(clientSecret, "Setup intent created successfully");
        }

        /// <summary>
        /// Add a new payment method for the current user
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ResponseDto<PaymentMethodDto>>> AddPaymentMethod(
            [FromBody] AddPaymentMethodDto dto,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            var paymentMethod = await _paymentMethodService.AddPaymentMethodAsync(userId, dto, cancellationToken);

            return OkResponse(paymentMethod, "Payment method added successfully");
        }

        /// <summary>
        /// Set a payment method as default
        /// </summary>
        [HttpPatch("{paymentMethodId}/set-default")]
        public async Task<ActionResult> SetDefaultPaymentMethod(
            string paymentMethodId,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            await _paymentMethodService.SetDefaultPaymentMethodAsync(userId, paymentMethodId, cancellationToken);

            return NoContent();
        }

        /// <summary>
        /// Remove a payment method
        /// </summary>
        [HttpDelete("{paymentMethodId}")]
        public async Task<ActionResult> RemovePaymentMethod(
            string paymentMethodId,
            CancellationToken cancellationToken)
        {
            var userId = GetUserIdFromClaims();
            await _paymentMethodService.RemovePaymentMethodAsync(userId, paymentMethodId, cancellationToken);

            return NoContent();
        }
    }
}
