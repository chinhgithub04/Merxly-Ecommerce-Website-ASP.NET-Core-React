using merxly.Application.Interfaces.Services;
using merxly.Application.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stripe;

namespace merxly.Infrastructure.Services
{
    public class StripeWebhookService : IStripeWebhookService
    {
        private readonly ILogger<StripeWebhookService> _logger;
        private readonly string _webhookSecret;

        public StripeWebhookService(
            ILogger<StripeWebhookService> logger,
            IOptions<StripeSettings> stripeSettings)
        {
            _logger = logger;
            _webhookSecret = stripeSettings.Value.WebhookSecret
                ?? throw new InvalidOperationException("Stripe WebhookSecret is not configured");
        }

        public async Task<Event> ConstructEventAsync(
            string json,
            string stripeSignatureHeader,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Verifying webhook signature");

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    stripeSignatureHeader,
                    _webhookSecret,
                    throwOnApiVersionMismatch: false);

                _logger.LogInformation(
                    "Webhook signature verified successfully. Event type: {EventType}, Event ID: {EventId}",
                    stripeEvent.Type,
                    stripeEvent.Id);

                return await Task.FromResult(stripeEvent);
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Failed to verify webhook signature");
                throw new UnauthorizedAccessException("Invalid webhook signature", ex);
            }
        }
    }
}
