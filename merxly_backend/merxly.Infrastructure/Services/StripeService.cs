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
    }
}
