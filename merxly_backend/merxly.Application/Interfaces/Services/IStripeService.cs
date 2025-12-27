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
    }
}
