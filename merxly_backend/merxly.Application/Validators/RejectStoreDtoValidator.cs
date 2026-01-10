using FluentValidation;
using merxly.Application.DTOs.Store;

namespace merxly.Application.Validators
{
    public class RejectStoreDtoValidator : AbstractValidator<RejectStoreDto>
    {
        public RejectStoreDtoValidator()
        {
            RuleFor(x => x.RejectionReason)
                .NotEmpty()
                .WithMessage("Rejection reason is required")
                .MaximumLength(500)
                .WithMessage("Rejection reason cannot exceed 500 characters");
        }
    }
}
