using FluentValidation;
using merxly.Application.DTOs.Store;

namespace merxly.Application.Validators
{
    public class ApproveStoreDtoValidator : AbstractValidator<ApproveStoreDto>
    {
        public ApproveStoreDtoValidator()
        {
            RuleFor(x => x.CommissionRate)
                .GreaterThanOrEqualTo(0)
                .LessThanOrEqualTo(1)
                .When(x => x.CommissionRate.HasValue)
                .WithMessage("Commission rate must be between 0 and 1 (0% to 100%)");
        }
    }
}
