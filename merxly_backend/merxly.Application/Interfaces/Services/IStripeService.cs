using Stripe;

namespace merxly.Application.Interfaces.Services
{
    public interface IStripeService
    {
        /// <summary>
        /// Creates a new Stripe customer for the user
        /// </summary>
        Task<Customer> CreateCustomerAsync(string email, string name, CancellationToken cancellationToken = default);

        /// <summary>
        /// Attaches a payment method to a Stripe customer
        /// </summary>
        Task<PaymentMethod> AttachPaymentMethodAsync(string paymentMethodId, string customerId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Detaches a payment method from a Stripe customer
        /// </summary>
        Task<PaymentMethod> DetachPaymentMethodAsync(string paymentMethodId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Lists all payment methods for a customer
        /// </summary>
        Task<List<PaymentMethod>> ListPaymentMethodsAsync(string customerId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Sets a payment method as the default for a customer
        /// </summary>
        Task<Customer> SetDefaultPaymentMethodAsync(string customerId, string paymentMethodId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets a specific payment method by ID
        /// </summary>
        Task<PaymentMethod> GetPaymentMethodAsync(string paymentMethodId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates a setup intent for collecting payment method details
        /// </summary>
        Task<SetupIntent> CreateSetupIntentAsync(string customerId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets a setup intent by ID
        /// </summary>
        Task<SetupIntent> GetSetupIntentAsync(string setupIntentId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates a payment intent for a customer
        /// </summary>
        Task<PaymentIntent> CreatePaymentIntentAsync(string customerId, decimal amount, string currency, string? paymentMethodId = null, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Confirms a payment intent
        /// </summary>
        Task<PaymentIntent> ConfirmPaymentIntentAsync(string paymentIntentId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Gets a payment intent by ID
        /// </summary>
        Task<PaymentIntent> GetPaymentIntentAsync(string paymentIntentId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Cancels a payment intent
        /// </summary>
        Task<PaymentIntent> CancelPaymentIntentAsync(string paymentIntentId, CancellationToken cancellationToken = default);

        // Stripe Connect Methods

        /// <summary>
        /// Creates a Stripe Connect account for a store
        /// </summary>
        Task<Account> CreateConnectAccountAsync(string email, string country, string businessType, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates an account link for onboarding or updating a Connect account
        /// </summary>
        Task<AccountLink> CreateAccountLinkAsync(string accountId, string returnUrl, string refreshUrl, string type = "account_onboarding", CancellationToken cancellationToken = default);

        /// <summary>
        /// Retrieves a Stripe Connect account
        /// </summary>
        Task<Account> GetConnectAccountAsync(string accountId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Updates a Stripe Connect account
        /// </summary>
        Task<Account> UpdateConnectAccountAsync(string accountId, Dictionary<string, string>? metadata = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Deletes (or deactivates) a Stripe Connect account
        /// </summary>
        Task<Account> DeleteConnectAccountAsync(string accountId, CancellationToken cancellationToken = default);
    }
}
