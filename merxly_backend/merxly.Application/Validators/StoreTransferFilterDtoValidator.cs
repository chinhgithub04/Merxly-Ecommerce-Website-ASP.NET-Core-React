using FluentValidation;
using merxly.Application.DTOs.StoreTransfer;
using merxly.Application.Validators.Common;

namespace merxly.Application.Validators
{
    public class StoreTransferFilterDtoValidator : AbstractValidator<StoreTransferFilterDto>
    {
        public StoreTransferFilterDtoValidator()
        {
            Include(new PaginationQueryValidator());

            RuleFor(x => x.FromDate)
                .LessThanOrEqualTo(x => x.ToDate ?? DateTime.MaxValue)
                .When(x => x.FromDate.HasValue)
                .WithMessage("FromDate must be less than or equal to ToDate");

            RuleFor(x => x.MinAmount)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MinAmount.HasValue)
                .WithMessage("MinAmount must be greater than or equal to 0");

            RuleFor(x => x.MaxAmount)
                .GreaterThanOrEqualTo(x => x.MinAmount ?? 0)
                .When(x => x.MaxAmount.HasValue)
                .WithMessage("MaxAmount must be greater than or equal to MinAmount");

        }
    }
}
