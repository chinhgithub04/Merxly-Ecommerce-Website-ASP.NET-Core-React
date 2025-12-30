using Stripe;

namespace merxly.Application.Interfaces.Services
{
    public interface IStripeWebhookService
    {
        /// <summary>
        /// Verifies the webhook signature and constructs a Stripe Event
        /// </summary>
        /// <param name="json">Raw request body as string</param>
        /// <param name="stripeSignatureHeader">Value of Stripe-Signature header</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Verified Stripe Event</returns>
        Task<Event> ConstructEventAsync(
            string json,
            string stripeSignatureHeader,
            CancellationToken cancellationToken = default);
    }
}
