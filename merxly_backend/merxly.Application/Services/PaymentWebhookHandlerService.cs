using merxly.Application.Interfaces;
using merxly.Application.Interfaces.Services;
using merxly.Domain.Enums;
using Microsoft.Extensions.Logging;
using Stripe;

namespace merxly.Application.Services
{
    public class PaymentWebhookHandlerService : IPaymentWebhookHandlerService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PaymentWebhookHandlerService> _logger;

        public PaymentWebhookHandlerService(
            IUnitOfWork unitOfWork,
            ILogger<PaymentWebhookHandlerService> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task HandlePaymentSucceededAsync(Event stripeEvent, CancellationToken cancellationToken = default)
        {
            var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
            if (paymentIntent == null)
            {
                _logger.LogWarning("PaymentIntent data is null in event {EventId}", stripeEvent.Id);
                return;
            }

            _logger.LogInformation(
                "Processing payment_intent.succeeded event for PaymentIntent {PaymentIntentId}",
                paymentIntent.Id);

            var payment = await _unitOfWork.Payment.GetByPaymentIntentIdAsync(
                paymentIntent.Id,
                cancellationToken);

            if (payment == null)
            {
                _logger.LogWarning(
                    "Payment not found for PaymentIntent {PaymentIntentId}. Event {EventId} skipped.",
                    paymentIntent.Id,
                    stripeEvent.Id);
                return;
            }

            // Check if already processed (idempotency)
            if (payment.Status == PaymentStatus.Succeeded)
            {
                _logger.LogInformation(
                    "Payment {PaymentId} already marked as succeeded. Event {EventId} was idempotent.",
                    payment.Id,
                    stripeEvent.Id);
                return;
            }

            // Update payment status
            payment.Status = PaymentStatus.Succeeded;
            payment.PaidAt = DateTime.UtcNow;

            _unitOfWork.Payment.Update(payment);

            // Update all SubOrders to Confirmed status
            var subOrders = await _unitOfWork.SubOrder.GetByOrderIdAsync(
                payment.OrderId,
                cancellationToken);

            foreach (var subOrder in subOrders)
            {
                // Only update if still in Pending status
                if (subOrder.Status == OrderStatus.Pending)
                {
                    subOrder.Status = OrderStatus.Confirmed;
                    subOrder.UpdatedAt = DateTime.UtcNow;
                    _unitOfWork.SubOrder.Update(subOrder);

                    _logger.LogInformation(
                        "SubOrder {SubOrderNumber} status updated to Confirmed",
                        subOrder.SubOrderNumber);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Payment {PaymentId} marked as succeeded. {SubOrderCount} sub-orders confirmed.",
                payment.Id,
                subOrders.Count);
        }

        public async Task HandlePaymentFailedAsync(Event stripeEvent, CancellationToken cancellationToken = default)
        {
            var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
            if (paymentIntent == null)
            {
                _logger.LogWarning("PaymentIntent data is null in event {EventId}", stripeEvent.Id);
                return;
            }

            _logger.LogInformation(
                "Processing payment_intent.payment_failed event for PaymentIntent {PaymentIntentId}",
                paymentIntent.Id);

            var payment = await _unitOfWork.Payment.GetByPaymentIntentIdAsync(
                paymentIntent.Id,
                cancellationToken);

            if (payment == null)
            {
                _logger.LogWarning(
                    "Payment not found for PaymentIntent {PaymentIntentId}. Event {EventId} skipped.",
                    paymentIntent.Id,
                    stripeEvent.Id);
                return;
            }

            // Check if already processed (idempotency)
            if (payment.Status == PaymentStatus.Failed)
            {
                _logger.LogInformation(
                    "Payment {PaymentId} already marked as failed. Event {EventId} was idempotent.",
                    payment.Id,
                    stripeEvent.Id);
                return;
            }

            // Update payment status
            payment.Status = PaymentStatus.Failed;
            payment.FailureMessage = paymentIntent.LastPaymentError?.Message ?? "Payment failed";
            payment.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Payment.Update(payment);

            // Update all SubOrders to Failed status
            var subOrders = await _unitOfWork.SubOrder.GetByOrderIdAsync(
                payment.OrderId,
                cancellationToken);

            foreach (var subOrder in subOrders)
            {
                // Only update if still in Pending or Confirmed status
                if (subOrder.Status == OrderStatus.Pending || subOrder.Status == OrderStatus.Confirmed)
                {
                    subOrder.Status = OrderStatus.Failed;
                    subOrder.UpdatedAt = DateTime.UtcNow;
                    _unitOfWork.SubOrder.Update(subOrder);

                    _logger.LogInformation(
                        "SubOrder {SubOrderNumber} status updated to Failed",
                        subOrder.SubOrderNumber);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation(
                "Payment {PaymentId} marked as failed. Failure message: {FailureMessage}. {SubOrderCount} sub-orders marked as failed.",
                payment.Id,
                payment.FailureMessage,
                subOrders.Count);
        }
    }
}
