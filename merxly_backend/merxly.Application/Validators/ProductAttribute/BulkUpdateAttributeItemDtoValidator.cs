using FluentValidation;
using merxly.Application.DTOs.ProductAttribute.Update;

namespace merxly.Application.Validators.ProductAttribute
{
    public class BulkUpdateAttributeItemDtoValidator : AbstractValidator<BulkUpdateAttributeItemDto>
    {
        public BulkUpdateAttributeItemDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Attribute ID is required.");

            RuleFor(x => x.Name)
                .MaximumLength(100).WithMessage("Attribute name cannot exceed 100 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.Name));

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative.")
                .When(x => x.DisplayOrder.HasValue);
        }
    }
}
