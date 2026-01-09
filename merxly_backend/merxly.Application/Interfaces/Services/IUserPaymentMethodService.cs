using merxly.Application.DTOs.PaymentMethod;

namespace merxly.Application.Interfaces.Services
{
    public interface IUserPaymentMethodService
    {
        /// <summary>
        /// Gets all payment methods for the current user
        /// </summary>
        Task<List<PaymentMethodDto>> GetUserPaymentMethodsAsync(string userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates a setup intent for adding a payment method
        /// </summary>
        Task<string> CreateSetupIntentAsync(string userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Adds a new payment method for the user
        /// </summary>
        Task<PaymentMethodDto> AddPaymentMethodAsync(string userId, AddPaymentMethodDto dto, CancellationToken cancellationToken = default);

        /// <summary>
        /// Sets a payment method as the default for the user
        /// </summary>
        Task SetDefaultPaymentMethodAsync(string userId, string paymentMethodId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Removes a payment method from the user
        /// </summary>
        Task RemovePaymentMethodAsync(string userId, string paymentMethodId, CancellationToken cancellationToken = default);
    }
}
