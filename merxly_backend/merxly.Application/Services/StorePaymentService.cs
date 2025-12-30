using merxly.Application.DTOs.StorePayment;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Repositories;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class StorePaymentService : IStorePaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStripeService _stripeService;
        private readonly ILogger<StorePaymentService> _logger;

        public StorePaymentService(
            IUnitOfWork unitOfWork,
            IStripeService stripeService,
            ILogger<StorePaymentService> logger)
        {
            _unitOfWork = unitOfWork;
            _stripeService = stripeService;
            _logger = logger;
        }

        public async Task<StorePaymentAccountDto> GetStorePaymentAccountAsync(string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting payment account for user: {UserId}", userId);

            var store = await GetStoreByOwnerIdAsync(userId, cancellationToken);

            return new StorePaymentAccountDto
            {
                StoreId = store.Id,
                StoreName = store.StoreName,
                StripeConnectAccountId = store.StripeConnectAccountId,
                IsPayoutEnabled = store.IsPayoutEnabled,
                StripeAccountStatus = store.StripeAccountStatus,
                CommissionRate = store.CommissionRate
            };
        }

        public async Task<StorePaymentAccountDto> CreateConnectAccountAsync(
            string userId,
            CreateConnectAccountDto dto,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating Stripe Connect account for user: {UserId}", userId);

            var store = await GetStoreByOwnerIdAsync(userId, cancellationToken);

            // Check if store already has a Connect account
            if (!string.IsNullOrEmpty(store.StripeConnectAccountId))
            {
                throw new InvalidOperationException("Store already has a Stripe Connect account");
            }

            // Create Stripe Connect account
            var metadata = new Dictionary<string, string>
            {
                { "store_id", store.Id.ToString() },
                { "store_name", store.StoreName }
            };

            var account = await _stripeService.CreateConnectAccountAsync(
                dto.Email,
                dto.Country,
                dto.BusinessType,
                metadata,
                cancellationToken);

            // Update store with Stripe account information
            store.StripeConnectAccountId = account.Id;
            store.StripeAccountStatus = "pending";
            store.IsPayoutEnabled = false;

            _unitOfWork.Store.Update(store);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Stripe Connect account created for store: {StoreId}, account: {AccountId}",
                store.Id, account.Id);

            return new StorePaymentAccountDto
            {
                StoreId = store.Id,
                StoreName = store.StoreName,
                StripeConnectAccountId = store.StripeConnectAccountId,
                IsPayoutEnabled = store.IsPayoutEnabled,
                StripeAccountStatus = store.StripeAccountStatus,
                CommissionRate = store.CommissionRate
            };
        }

        public async Task<ConnectAccountLinkDto> CreateAccountLinkAsync(
            string userId,
            CreateAccountLinkRequestDto dto,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating account link for user: {UserId}", userId);

            var store = await GetStoreByOwnerIdAsync(userId, cancellationToken);

            // Validate that store has a Connect account
            if (string.IsNullOrEmpty(store.StripeConnectAccountId))
            {
                throw new InvalidOperationException("Store does not have a Stripe Connect account. Create one first.");
            }

            // Create account link
            var accountLink = await _stripeService.CreateAccountLinkAsync(
                store.StripeConnectAccountId,
                dto.ReturnUrl,
                dto.RefreshUrl,
                dto.Type,
                cancellationToken);

            _logger.LogInformation("Account link created for store: {StoreId}", store.Id);

            return new ConnectAccountLinkDto
            {
                AccountLinkUrl = accountLink.Url,
                ExpiresAt = accountLink.ExpiresAt
            };
        }

        public async Task<ConnectAccountStatusDto> GetConnectAccountStatusAsync(
            string userId,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting Connect account status for user: {UserId}", userId);

            var store = await GetStoreByOwnerIdAsync(userId, cancellationToken);

            // Validate that store has a Connect account
            if (string.IsNullOrEmpty(store.StripeConnectAccountId))
            {
                throw new InvalidOperationException("Store does not have a Stripe Connect account");
            }

            return new ConnectAccountStatusDto
            {
                StripeAccountId = store.StripeConnectAccountId,
                Status = store.StripeAccountStatus ?? "unknown",
                ChargesEnabled = false,
                PayoutsEnabled = store.IsPayoutEnabled,
                DetailsSubmitted = !string.IsNullOrEmpty(store.StripeAccountStatus) && store.StripeAccountStatus != "pending",
                Requirements = new List<string>(),
                PendingVerification = new List<string>(),
                Errors = new List<string>()
            };
        }

        public async Task<ConnectAccountStatusDto> RefreshConnectAccountStatusAsync(
            string userId,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Refreshing Connect account status for user: {UserId}", userId);

            var store = await GetStoreByOwnerIdAsync(userId, cancellationToken);

            // Validate that store has a Connect account
            if (string.IsNullOrEmpty(store.StripeConnectAccountId))
            {
                throw new InvalidOperationException("Store does not have a Stripe Connect account");
            }

            // Get account details from Stripe
            var account = await _stripeService.GetConnectAccountAsync(
                store.StripeConnectAccountId,
                cancellationToken);

            // Update store status based on Stripe account
            var previousStatus = store.StripeAccountStatus;
            var previousPayoutEnabled = store.IsPayoutEnabled;

            if (account.ChargesEnabled && account.PayoutsEnabled)
            {
                store.StripeAccountStatus = "complete";
                store.IsPayoutEnabled = true;
            }
            else if (account.DetailsSubmitted)
            {
                store.StripeAccountStatus = "restricted";
                store.IsPayoutEnabled = false;
            }
            else
            {
                store.StripeAccountStatus = "pending";
                store.IsPayoutEnabled = false;
            }

            // Save changes if status changed
            if (previousStatus != store.StripeAccountStatus || previousPayoutEnabled != store.IsPayoutEnabled)
            {
                store.UpdatedAt = DateTime.UtcNow;
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                _logger.LogInformation("Store {StoreId} status updated: {OldStatus} -> {NewStatus}, payouts: {PayoutsEnabled}",
                    store.Id, previousStatus, store.StripeAccountStatus, store.IsPayoutEnabled);
            }

            // Map requirements and errors
            var requirements = new List<string>();
            var pendingVerification = new List<string>();
            var errors = new List<string>();

            if (account.Requirements?.CurrentlyDue != null)
            {
                requirements.AddRange(account.Requirements.CurrentlyDue);
            }

            if (account.Requirements?.PendingVerification != null)
            {
                pendingVerification.AddRange(account.Requirements.PendingVerification);
            }

            if (account.Requirements?.Errors != null)
            {
                errors.AddRange(account.Requirements.Errors.Select(e => e.Reason));
            }

            return new ConnectAccountStatusDto
            {
                StripeAccountId = store.StripeConnectAccountId,
                Status = store.StripeAccountStatus,
                ChargesEnabled = account.ChargesEnabled,
                PayoutsEnabled = store.IsPayoutEnabled,
                DetailsSubmitted = account.DetailsSubmitted,
                Requirements = requirements,
                PendingVerification = pendingVerification,
                Errors = errors
            };
        }

        public async Task DisconnectConnectAccountAsync(string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Disconnecting Connect account for user: {UserId}", userId);

            var store = await GetStoreByOwnerIdAsync(userId, cancellationToken);

            // Validate that store has a Connect account
            if (string.IsNullOrEmpty(store.StripeConnectAccountId))
            {
                throw new InvalidOperationException("Store does not have a Stripe Connect account");
            }

            var accountId = store.StripeConnectAccountId;

            // Delete the Stripe Connect account
            await _stripeService.DeleteConnectAccountAsync(accountId, cancellationToken);

            // Clear store's Stripe information
            store.StripeConnectAccountId = null;
            store.StripeAccountStatus = null;
            store.IsPayoutEnabled = false;

            _unitOfWork.Store.Update(store);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Stripe Connect account disconnected for store: {StoreId}, account was: {AccountId}",
                store.Id, accountId);
        }

        private async Task<Domain.Entities.Store> GetStoreByOwnerIdAsync(string userId, CancellationToken cancellationToken)
        {
            var storeId = await _unitOfWork.Store.GetStoreIdByOwnerIdAsync(userId, cancellationToken);

            if (!storeId.HasValue)
            {
                throw new NotFoundException("Store not found for the current user");
            }

            var store = await _unitOfWork.Store.GetByIdAsync(storeId.Value, cancellationToken);

            if (store == null)
            {
                throw new NotFoundException($"Store with ID {storeId.Value} not found");
            }

            return store;
        }
    }
}
