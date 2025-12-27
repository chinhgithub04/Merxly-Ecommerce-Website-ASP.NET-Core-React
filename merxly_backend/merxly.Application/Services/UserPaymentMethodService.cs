using AutoMapper;
using merxly.Application.DTOs.PaymentMethod;
using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Exceptions;
using Microsoft.Extensions.Logging;

namespace merxly.Application.Services
{
    public class UserPaymentMethodService : IUserPaymentMethodService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStripeService _stripeService;
        private readonly IMapper _mapper;
        private readonly ILogger<UserPaymentMethodService> _logger;

        public UserPaymentMethodService(
            IUnitOfWork unitOfWork,
            IStripeService stripeService,
            IMapper mapper,
            ILogger<UserPaymentMethodService> logger)
        {
            _unitOfWork = unitOfWork;
            _stripeService = stripeService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<List<PaymentMethodDto>> GetUserPaymentMethodsAsync(string userId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Getting payment methods for user: {UserId}", userId);

            var user = await _unitOfWork.ApplicationUser.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found: {UserId}", userId);
                throw new NotFoundException($"User with ID {userId} not found");
            }

            // If user doesn't have a Stripe customer ID, return empty list
            if (string.IsNullOrEmpty(user.StripeCustomerId))
            {
                _logger.LogInformation("User {UserId} has no Stripe customer ID", userId);
                return new List<PaymentMethodDto>();
            }

            // Get payment methods from Stripe
            var stripePaymentMethods = await _stripeService.ListPaymentMethodsAsync(user.StripeCustomerId, cancellationToken);

            // Map to DTOs
            var paymentMethods = stripePaymentMethods.Select(pm => new PaymentMethodDto
            {
                Id = pm.Id,
                Type = pm.Type,
                Card = pm.Card != null ? new CardDetailsDto
                {
                    Brand = pm.Card.Brand,
                    Last4 = pm.Card.Last4,
                    ExpMonth = (int)pm.Card.ExpMonth,
                    ExpYear = (int)pm.Card.ExpYear
                } : null,
                IsDefault = pm.Id == user.DefaultPaymentMethodId,
                CreatedAt = pm.Created
            }).ToList();

            _logger.LogInformation("Found {Count} payment methods for user: {UserId}", paymentMethods.Count, userId);
            return paymentMethods;
        }

        public async Task<PaymentMethodDto> AddPaymentMethodAsync(string userId, AddPaymentMethodDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Adding payment method for user: {UserId}", userId);

            var user = await _unitOfWork.ApplicationUser.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found: {UserId}", userId);
                throw new NotFoundException($"User with ID {userId} not found");
            }

            // Create Stripe customer if user doesn't have one
            if (string.IsNullOrEmpty(user.StripeCustomerId))
            {
                _logger.LogInformation("Creating Stripe customer for user: {UserId}", userId);
                var customer = await _stripeService.CreateCustomerAsync(
                    user.Email!,
                    $"{user.FirstName} {user.LastName}",
                    cancellationToken);

                user.StripeCustomerId = customer.Id;
                _unitOfWork.ApplicationUser.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            // Attach payment method to customer
            var paymentMethod = await _stripeService.AttachPaymentMethodAsync(
                dto.PaymentMethodId,
                user.StripeCustomerId,
                cancellationToken);

            // If this is the first payment method, set it as default
            var existingPaymentMethods = await _stripeService.ListPaymentMethodsAsync(user.StripeCustomerId, cancellationToken);
            if (existingPaymentMethods.Count == 1)
            {
                _logger.LogInformation("Setting first payment method as default for user: {UserId}", userId);
                await _stripeService.SetDefaultPaymentMethodAsync(user.StripeCustomerId, paymentMethod.Id, cancellationToken);
                user.DefaultPaymentMethodId = paymentMethod.Id;
                _unitOfWork.ApplicationUser.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            // Map to DTO
            var result = new PaymentMethodDto
            {
                Id = paymentMethod.Id,
                Type = paymentMethod.Type,
                Card = paymentMethod.Card != null ? new CardDetailsDto
                {
                    Brand = paymentMethod.Card.Brand,
                    Last4 = paymentMethod.Card.Last4,
                    ExpMonth = (int)paymentMethod.Card.ExpMonth,
                    ExpYear = (int)paymentMethod.Card.ExpYear
                } : null,
                IsDefault = paymentMethod.Id == user.DefaultPaymentMethodId,
                CreatedAt = paymentMethod.Created
            };

            _logger.LogInformation("Payment method added successfully for user: {UserId}", userId);
            return result;
        }

        public async Task SetDefaultPaymentMethodAsync(string userId, string paymentMethodId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Setting default payment method {PaymentMethodId} for user: {UserId}", paymentMethodId, userId);

            var user = await _unitOfWork.ApplicationUser.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found: {UserId}", userId);
                throw new NotFoundException($"User with ID {userId} not found");
            }

            if (string.IsNullOrEmpty(user.StripeCustomerId))
            {
                _logger.LogWarning("User {UserId} has no Stripe customer ID", userId);
                throw new InvalidOperationException("User has no payment methods");
            }

            // Verify payment method belongs to user
            var paymentMethod = await _stripeService.GetPaymentMethodAsync(paymentMethodId, cancellationToken);
            if (paymentMethod.CustomerId != user.StripeCustomerId)
            {
                _logger.LogWarning("Payment method {PaymentMethodId} does not belong to user {UserId}", paymentMethodId, userId);
                throw new InvalidOperationException("Payment method does not belong to user");
            }

            // Set as default in Stripe
            await _stripeService.SetDefaultPaymentMethodAsync(user.StripeCustomerId, paymentMethodId, cancellationToken);

            // Update database
            user.DefaultPaymentMethodId = paymentMethodId;
            _unitOfWork.ApplicationUser.Update(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Default payment method updated successfully for user: {UserId}", userId);
        }

        public async Task RemovePaymentMethodAsync(string userId, string paymentMethodId, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Removing payment method {PaymentMethodId} for user: {UserId}", paymentMethodId, userId);

            var user = await _unitOfWork.ApplicationUser.GetByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                _logger.LogWarning("User not found: {UserId}", userId);
                throw new NotFoundException($"User with ID {userId} not found");
            }

            if (string.IsNullOrEmpty(user.StripeCustomerId))
            {
                _logger.LogWarning("User {UserId} has no Stripe customer ID", userId);
                throw new InvalidOperationException("User has no payment methods");
            }

            // Verify payment method belongs to user
            var paymentMethod = await _stripeService.GetPaymentMethodAsync(paymentMethodId, cancellationToken);
            if (paymentMethod.CustomerId != user.StripeCustomerId)
            {
                _logger.LogWarning("Payment method {PaymentMethodId} does not belong to user {UserId}", paymentMethodId, userId);
                throw new InvalidOperationException("Payment method does not belong to user");
            }

            // Detach from Stripe
            await _stripeService.DetachPaymentMethodAsync(paymentMethodId, cancellationToken);

            // If this was the default payment method, clear it from database
            if (user.DefaultPaymentMethodId == paymentMethodId)
            {
                user.DefaultPaymentMethodId = null;
                _unitOfWork.ApplicationUser.Update(user);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            _logger.LogInformation("Payment method removed successfully for user: {UserId}", userId);
        }
    }
}
