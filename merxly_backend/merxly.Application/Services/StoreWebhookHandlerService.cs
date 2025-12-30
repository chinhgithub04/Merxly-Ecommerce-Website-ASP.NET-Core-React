using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;
using Stripe;

namespace merxly.Application.Services
{
    public class StoreWebhookHandlerService : IStoreWebhookHandlerService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<StoreWebhookHandlerService> _logger;

        public StoreWebhookHandlerService(
            IUnitOfWork unitOfWork,
            ILogger<StoreWebhookHandlerService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task HandleAccountUpdatedAsync(Event stripeEvent, CancellationToken cancellationToken = default)
        {
            var account = stripeEvent.Data.Object as Account;
            if (account == null)
            {
                _logger.LogWarning("Account data is null in event {EventId}", stripeEvent.Id);
                return;
            }

            _logger.LogInformation(
                "Processing account.updated event for account {AccountId}",
                account.Id);

            var store = await _unitOfWork.Store.GetByStripeConnectAccountIdAsync(
                account.Id,
                cancellationToken);

            if (store == null)
            {
                _logger.LogWarning(
                    "Store not found for Stripe account {AccountId}. Event {EventId} skipped.",
                    account.Id,
                    stripeEvent.Id);
                return;
            }

            // Check if already processed (idempotency)
            var currentStatus = store.StripeAccountStatus;
            var currentPayoutEnabled = store.IsPayoutEnabled;

            // Update account status
            store.StripeAccountStatus = account.ChargesEnabled && account.PayoutsEnabled
                ? "complete"
                : account.Requirements?.CurrentlyDue?.Count > 0
                    ? "pending"
                    : "restricted";

            // Update payout capability
            store.IsPayoutEnabled = account.ChargesEnabled && account.PayoutsEnabled;

            // Only save if there are changes
            if (store.StripeAccountStatus != currentStatus || store.IsPayoutEnabled != currentPayoutEnabled)
            {
                _unitOfWork.Store.Update(store);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                _logger.LogInformation(
                    "Store {StoreId} updated: Status={Status}, PayoutEnabled={PayoutEnabled}",
                    store.Id,
                    store.StripeAccountStatus,
                    store.IsPayoutEnabled);
            }
            else
            {
                _logger.LogInformation(
                    "No changes detected for Store {StoreId}. Event {EventId} was idempotent.",
                    store.Id,
                    stripeEvent.Id);
            }
        }

        public async Task HandleCapabilityUpdatedAsync(Event stripeEvent, CancellationToken cancellationToken = default)
        {
            var capability = stripeEvent.Data.Object as Capability;
            if (capability == null)
            {
                _logger.LogWarning("Capability data is null in event {EventId}", stripeEvent.Id);
                return;
            }

            _logger.LogInformation(
                "Processing capability.updated event for account {AccountId}, capability {CapabilityId}",
                capability.AccountId,
                capability.Id);

            var store = await _unitOfWork.Store.GetByStripeConnectAccountIdAsync(
                capability.AccountId,
                cancellationToken);

            if (store == null)
            {
                _logger.LogWarning(
                    "Store not found for Stripe account {AccountId}. Event {EventId} skipped.",
                    capability.AccountId,
                    stripeEvent.Id);
                return;
            }

            // Check if already processed (idempotency)
            var currentPayoutEnabled = store.IsPayoutEnabled;

            // Only enable payouts if both card_payments and transfers are active
            bool isActive = capability.Status == "active";

            if (capability.Id == "card_payments" || capability.Id == "transfers")
            {
                if (isActive)
                {
                    store.IsPayoutEnabled = true;
                    store.StripeAccountStatus = "complete";
                }
                else
                {
                    store.IsPayoutEnabled = false;
                    store.StripeAccountStatus = capability.Status == "pending" ? "pending" : "restricted";
                }

                // Only save if there are changes
                if (store.IsPayoutEnabled != currentPayoutEnabled)
                {
                    _unitOfWork.Store.Update(store);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    _logger.LogInformation(
                        "Store {StoreId} capability updated: Capability={Capability}, Status={Status}, PayoutEnabled={PayoutEnabled}",
                        store.Id,
                        capability.Id,
                        capability.Status,
                        store.IsPayoutEnabled);
                }
                else
                {
                    _logger.LogInformation(
                        "No changes detected for Store {StoreId}. Event {EventId} was idempotent.",
                        store.Id,
                        stripeEvent.Id);
                }
            }
        }

        public async Task HandleAccountDeauthorizedAsync(Event stripeEvent, CancellationToken cancellationToken = default)
        {
            var deauthorization = stripeEvent.Data.Object as Stripe.Account;
            if (deauthorization == null)
            {
                _logger.LogWarning("Deauthorization data is null in event {EventId}", stripeEvent.Id);
                return;
            }

            var accountId = deauthorization.Id;

            _logger.LogInformation(
                "Processing account.application.deauthorized event for account {AccountId}",
                accountId);

            var store = await _unitOfWork.Store.GetByStripeConnectAccountIdAsync(
                accountId,
                cancellationToken);

            if (store == null)
            {
                _logger.LogWarning(
                    "Store not found for Stripe account {AccountId}. Event {EventId} skipped.",
                    accountId,
                    stripeEvent.Id);
                return;
            }

            // Check if already disconnected (idempotency)
            if (store.StripeConnectAccountId == null)
            {
                _logger.LogInformation(
                    "Store {StoreId} already disconnected. Event {EventId} was idempotent.",
                    store.Id,
                    stripeEvent.Id);
                return;
            }

            // Disconnect the account
            store.StripeConnectAccountId = null;
            store.IsPayoutEnabled = false;
            store.StripeAccountStatus = null;

            _unitOfWork.Store.Update(store);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Store {StoreId} disconnected from Stripe Connect account {AccountId}",
                store.Id,
                accountId);
        }
    }
}
