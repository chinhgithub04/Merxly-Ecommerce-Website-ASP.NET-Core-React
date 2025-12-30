using Stripe;

namespace merxly.Application.Interfaces.Services
{
    public interface IPaymentWebhookHandlerService
    {
        /// <summary>
        /// Handles payment_intent.succeeded event - updates payment and sub-order status
        /// </summary>
        Task HandlePaymentSucceededAsync(Event stripeEvent, CancellationToken cancellationToken = default);

        /// <summary>
        /// Handles payment_intent.payment_failed event - updates payment status to failed
        /// </summary>
        Task HandlePaymentFailedAsync(Event stripeEvent, CancellationToken cancellationToken = default);
    }
}
