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
                .Must(id => id.StartsWith("pm_")).WithMessage("Invalid payment method ID format");
        }
    }
}
