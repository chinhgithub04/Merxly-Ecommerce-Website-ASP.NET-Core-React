using FluentValidation;
using merxly.Application.DTOs.Order;
using merxly.Application.Validators.Common;

namespace merxly.Application.Validators.Order
{
    public class StoreSubOrderFilterDtoValidator : AbstractValidator<StoreSubOrderFilterDto>
    {
        public StoreSubOrderFilterDtoValidator()
        {
            Include(new PaginationQueryValidator());

            RuleFor(x => x.Status)
                .IsInEnum()
                .When(x => x.Status.HasValue)
                .WithMessage("Invalid order status.");

            RuleFor(x => x.SearchTerm)
                .MaximumLength(200)
                .WithMessage("Search term must not exceed 200 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.SearchTerm));

            RuleFor(x => x.FromDate)
                .LessThanOrEqualTo(x => x.ToDate)
                .When(x => x.FromDate.HasValue && x.ToDate.HasValue)
                .WithMessage("FromDate must be less than or equal to ToDate.");
        }
    }
}
