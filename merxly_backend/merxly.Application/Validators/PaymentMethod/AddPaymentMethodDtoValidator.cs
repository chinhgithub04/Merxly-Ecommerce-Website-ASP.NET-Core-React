using FluentValidation;
using merxly.Application.DTOs.PaymentMethod;

namespace merxly.Application.Validators.PaymentMethod
{
    public class AddPaymentMethodDtoValidator : AbstractValidator<AddPaymentMethodDto>
    {
        public AddPaymentMethodDtoValidator()
        {
            RuleFor(x => x.PaymentMethodId)
                .NotEmpty().WithMessage("Payment method ID is required")
                .Must(id => id.StartsWith("pm_") || id.StartsWith("seti_"))
                .WithMessage("Invalid payment method ID format. Must be a payment method ID (pm_) or setup intent ID (seti_)");
        }
    }
}
