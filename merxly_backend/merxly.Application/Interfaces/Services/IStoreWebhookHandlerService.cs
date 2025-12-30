using Stripe;

namespace merxly.Application.Interfaces.Services
{
    public interface IStoreWebhookHandlerService
    {
        /// <summary>
        /// Handles account.updated event - updates store's Stripe account status
        /// </summary>
        Task HandleAccountUpdatedAsync(Event stripeEvent, CancellationToken cancellationToken = default);

        /// <summary>
        /// Handles capability.updated event - updates store's payout capabilities
        /// </summary>
        Task HandleCapabilityUpdatedAsync(Event stripeEvent, CancellationToken cancellationToken = default);

        /// <summary>
        /// Handles account.application.deauthorized event - disconnects store's Stripe account
        /// </summary>
        Task HandleAccountDeauthorizedAsync(Event stripeEvent, CancellationToken cancellationToken = default);
    }
}
