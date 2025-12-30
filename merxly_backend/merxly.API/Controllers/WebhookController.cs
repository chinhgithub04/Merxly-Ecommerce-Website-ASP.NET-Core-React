using merxly.Application.DTOs.Common;
using merxly.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace merxly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebhookController : BaseApiController
    {
        private readonly IStripeWebhookService _stripeWebhookService;
        private readonly IStoreWebhookHandlerService _storeWebhookHandler;
        private readonly IPaymentWebhookHandlerService _paymentWebhookHandler;
        private readonly ILogger<WebhookController> _logger;

        public WebhookController(
            IStripeWebhookService stripeWebhookService,
            IStoreWebhookHandlerService storeWebhookHandler,
            IPaymentWebhookHandlerService paymentWebhookHandler,
            ILogger<WebhookController> logger)
        {
            _stripeWebhookService = stripeWebhookService;
            _storeWebhookHandler = storeWebhookHandler;
            _paymentWebhookHandler = paymentWebhookHandler;
            _logger = logger;
        }

        [HttpPost("stripe")]
        public async Task<ActionResult<ResponseDto<object>>> HandleStripeWebhook(CancellationToken cancellationToken = default)
        {
            // Read raw body
            string json;
            using (var reader = new StreamReader(Request.Body))
            {
                json = await reader.ReadToEndAsync();
            }

            // Get Stripe signature header
            var stripeSignature = Request.Headers["Stripe-Signature"].ToString();

            if (string.IsNullOrEmpty(stripeSignature))
            {
                _logger.LogWarning("Stripe-Signature header is missing");
                return BadRequestResponse<object>("Stripe-Signature header is missing");
            }

            // Verify and construct event
            var stripeEvent = await _stripeWebhookService.ConstructEventAsync(
                json,
                stripeSignature,
                cancellationToken);

            _logger.LogInformation(
                "Processing Stripe webhook event: {EventType} (ID: {EventId})",
                stripeEvent.Type,
                stripeEvent.Id);

            // Route to appropriate handler based on event type
            switch (stripeEvent.Type)
            {
                // Store Connect Events
                case "account.updated":
                    await _storeWebhookHandler.HandleAccountUpdatedAsync(stripeEvent, cancellationToken);
                    break;

                case "capability.updated":
                    await _storeWebhookHandler.HandleCapabilityUpdatedAsync(stripeEvent, cancellationToken);
                    break;

                case "account.application.deauthorized":
                    await _storeWebhookHandler.HandleAccountDeauthorizedAsync(stripeEvent, cancellationToken);
                    break;

                // Payment Events
                case "payment_intent.succeeded":
                    await _paymentWebhookHandler.HandlePaymentSucceededAsync(stripeEvent, cancellationToken);
                    break;

                case "payment_intent.payment_failed":
                    await _paymentWebhookHandler.HandlePaymentFailedAsync(stripeEvent, cancellationToken);
                    break;

                default:
                    _logger.LogInformation(
                        "Unhandled event type: {EventType}. Event ID: {EventId}",
                        stripeEvent.Type,
                        stripeEvent.Id);
                    break;
            }

            return OkResponse<object>(
                new { received = true },
                "Webhook processed successfully");
        }
    }
}
