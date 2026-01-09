using merxly.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Stripe;

namespace merxly.Infrastructure.Services
{
    public class StripeService : IStripeService
    {
        private readonly ILogger<StripeService> _logger;

        public StripeService(ILogger<StripeService> logger)
        {
            _logger = logger;
        }

        public async Task<Customer> CreateCustomerAsync(string email, string name, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating Stripe customer for email: {Email}", email);

            var options = new CustomerCreateOptions
            {
                Email = email,
                Name = name,
            };

            var service = new CustomerService();
            var customer = await service.CreateAsync(options, null, cancellationToken);

            _logger.LogInformation("Stripe customer created with ID: {CustomerId}", customer.Id);
            return customer;
        }

        public async Task<PaymentMethod> AttachPaymentMethodAsync(string paymentMethodId, string customerId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Attaching payment method {PaymentMethodId} to customer {CustomerId}", paymentMethodId, customerId);

            var options = new PaymentMethodAttachOptions
            {
                Customer = customerId,
            };

            var service = new PaymentMethodService();
            var paymentMethod = await service.AttachAsync(paymentMethodId, options, null, cancellationToken);

            _logger.LogInformation("Payment method attached successfully");
            return paymentMethod;
        }

        public async Task<PaymentMethod> DetachPaymentMethodAsync(string paymentMethodId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Detaching payment method {PaymentMethodId}", paymentMethodId);

            var service = new PaymentMethodService();
            var paymentMethod = await service.DetachAsync(paymentMethodId, null, null, cancellationToken);

            _logger.LogInformation("Payment method detached successfully");
            return paymentMethod;
        }

        public async Task<List<PaymentMethod>> ListPaymentMethodsAsync(string customerId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Listing payment methods for customer {CustomerId}", customerId);

            var options = new PaymentMethodListOptions
            {
                Customer = customerId,
                Type = "card",
            };

            var service = new PaymentMethodService();
            var paymentMethods = await service.ListAsync(options, null, cancellationToken);

            _logger.LogInformation("Found {Count} payment methods", paymentMethods.Data.Count);
            return paymentMethods.Data.ToList();
        }

        public async Task<Customer> SetDefaultPaymentMethodAsync(string customerId, string paymentMethodId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Setting default payment method {PaymentMethodId} for customer {CustomerId}", paymentMethodId, customerId);

            var options = new CustomerUpdateOptions
            {
                InvoiceSettings = new CustomerInvoiceSettingsOptions
                {
                    DefaultPaymentMethod = paymentMethodId,
                },
            };

            var service = new CustomerService();
            var customer = await service.UpdateAsync(customerId, options, null, cancellationToken);

            _logger.LogInformation("Default payment method updated successfully");
            return customer;
        }

        public async Task<PaymentMethod> GetPaymentMethodAsync(string paymentMethodId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving payment method {PaymentMethodId}", paymentMethodId);

            var service = new PaymentMethodService();
            var paymentMethod = await service.GetAsync(paymentMethodId, null, null, cancellationToken);

            return paymentMethod;
        }

        public async Task<SetupIntent> CreateSetupIntentAsync(string customerId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating setup intent for customer {CustomerId}", customerId);

            var options = new SetupIntentCreateOptions
            {
                Customer = customerId,
                PaymentMethodTypes = new List<string> { "card" },
            };

            var service = new SetupIntentService();
            var setupIntent = await service.CreateAsync(options, null, cancellationToken);

            _logger.LogInformation("Setup intent created with ID: {SetupIntentId}", setupIntent.Id);
            return setupIntent;
        }

        public async Task<SetupIntent> GetSetupIntentAsync(string setupIntentId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving setup intent {SetupIntentId}", setupIntentId);

            var service = new SetupIntentService();
            var setupIntent = await service.GetAsync(setupIntentId, null, null, cancellationToken);

            return setupIntent;
        }

        public async Task<PaymentIntent> CreatePaymentIntentAsync(
            string customerId,
            decimal amount,
            string currency,
            string? paymentMethodId = null,
            Dictionary<string, string>? metadata = null,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating payment intent for customer {CustomerId} with amount {Amount} {Currency}",
                customerId, amount, currency);

            // Zero-decimal currencies (amounts are in whole units, not cents)
            var zeroDecimalCurrencies = new HashSet<string> { "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf" };

            // Convert amount based on currency type
            long stripeAmount = zeroDecimalCurrencies.Contains(currency.ToLower())
                ? (long)amount  // Zero-decimal currencies: use amount as-is
                : (long)(amount * 100);  // Other currencies: convert to smallest unit (cents)

            var options = new PaymentIntentCreateOptions
            {
                Amount = stripeAmount,
                Currency = currency.ToLower(),
                Customer = customerId,
                PaymentMethod = paymentMethodId,
                Metadata = metadata,
                ConfirmationMethod = "automatic",
                CaptureMethod = "automatic",
            };

            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options, null, cancellationToken);

            _logger.LogInformation("Payment intent created with ID: {PaymentIntentId}, Amount: {StripeAmount}",
                paymentIntent.Id, stripeAmount);
            return paymentIntent;
        }

        public async Task<PaymentIntent> ConfirmPaymentIntentAsync(string paymentIntentId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Confirming payment intent {PaymentIntentId}", paymentIntentId);

            var service = new PaymentIntentService();
            var paymentIntent = await service.ConfirmAsync(paymentIntentId, null, null, cancellationToken);

            _logger.LogInformation("Payment intent confirmed with status: {Status}", paymentIntent.Status);
            return paymentIntent;
        }

        public async Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving payment intent {PaymentIntentId}", paymentIntentId);

            var service = new PaymentIntentService();
            var paymentIntent = await service.GetAsync(paymentIntentId, null, null, cancellationToken);

            return paymentIntent;
        }

        public async Task<PaymentIntent> CancelPaymentIntentAsync(string paymentIntentId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Canceling payment intent {PaymentIntentId}", paymentIntentId);

            var service = new PaymentIntentService();
            var paymentIntent = await service.CancelAsync(paymentIntentId, null, null, cancellationToken);

            _logger.LogInformation("Payment intent canceled");
            return paymentIntent;
        }

        // Stripe Connect Methods

        public async Task<Account> CreateConnectAccountAsync(
            string email,
            string country,
            string businessType,
            Dictionary<string, string>? metadata = null,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating Stripe Connect account for email: {Email}, country: {Country}", email, country);

            var options = new AccountCreateOptions
            {
                Type = "express",
                Country = country,
                Email = email,
                Capabilities = new AccountCapabilitiesOptions
                {
                    CardPayments = new AccountCapabilitiesCardPaymentsOptions { Requested = true },
                    Transfers = new AccountCapabilitiesTransfersOptions { Requested = true },
                },
                BusinessType = businessType,
                Metadata = metadata,
            };

            var service = new AccountService();
            var account = await service.CreateAsync(options, null, cancellationToken);

            _logger.LogInformation("Stripe Connect account created with ID: {AccountId}", account.Id);
            return account;
        }

        public async Task<AccountLink> CreateAccountLinkAsync(
            string accountId,
            string returnUrl,
            string refreshUrl,
            string type = "account_onboarding",
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating account link for account: {AccountId}, type: {Type}", accountId, type);

            var options = new AccountLinkCreateOptions
            {
                Account = accountId,
                RefreshUrl = refreshUrl,
                ReturnUrl = returnUrl,
                Type = type,
            };

            var service = new AccountLinkService();
            var accountLink = await service.CreateAsync(options, null, cancellationToken);

            _logger.LogInformation("Account link created, expires at: {ExpiresAt}", accountLink.ExpiresAt);
            return accountLink;
        }

        public async Task<Account> GetConnectAccountAsync(string accountId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving Stripe Connect account: {AccountId}", accountId);

            var service = new AccountService();
            var account = await service.GetAsync(accountId, null, null, cancellationToken);

            _logger.LogInformation("Account retrieved: charges_enabled={ChargesEnabled}, payouts_enabled={PayoutsEnabled}",
                account.ChargesEnabled, account.PayoutsEnabled);

            return account;
        }

        public async Task<Account> UpdateConnectAccountAsync(
            string accountId,
            Dictionary<string, string>? metadata = null,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Updating Stripe Connect account: {AccountId}", accountId);

            var options = new AccountUpdateOptions
            {
                Metadata = metadata,
            };

            var service = new AccountService();
            var account = await service.UpdateAsync(accountId, options, null, cancellationToken);

            _logger.LogInformation("Account updated successfully");
            return account;
        }

        public async Task<Account> DeleteConnectAccountAsync(string accountId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Deleting Stripe Connect account: {AccountId}", accountId);

            var service = new AccountService();
            var account = await service.DeleteAsync(accountId, null, null, cancellationToken);

            _logger.LogInformation("Account deleted successfully");
            return account;
        }
    }
}
