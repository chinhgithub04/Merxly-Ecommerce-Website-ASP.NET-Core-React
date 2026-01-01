using FluentValidation;
using merxly.Application.DTOs.Order;
using merxly.Domain.Enums;

namespace merxly.Application.Validators.Order
{
    public class UpdateSubOrderStatusDtoValidator : AbstractValidator<UpdateSubOrderStatusDto>
    {
        public UpdateSubOrderStatusDtoValidator()
        {
            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Invalid order status.");

            RuleFor(x => x.Notes)
                .MaximumLength(1000)
                .WithMessage("Notes must not exceed 1000 characters.")
                .When(x => !string.IsNullOrEmpty(x.Notes));

            RuleFor(x => x.Carrier)
                .MaximumLength(200)
                .WithMessage("Carrier name must not exceed 200 characters.")
                .When(x => !string.IsNullOrEmpty(x.Carrier));

            RuleFor(x => x.TrackingNumber)
                .MaximumLength(200)
                .WithMessage("Tracking number must not exceed 200 characters.")
                .When(x => !string.IsNullOrEmpty(x.TrackingNumber));
        }
    }
}
