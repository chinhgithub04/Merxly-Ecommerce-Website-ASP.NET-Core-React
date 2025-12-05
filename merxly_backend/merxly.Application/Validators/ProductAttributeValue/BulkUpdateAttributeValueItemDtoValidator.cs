using FluentValidation;
using merxly.Application.DTOs.ProductAttributeValue.Update;

namespace merxly.Application.Validators.ProductAttributeValue
{
    public class BulkUpdateAttributeValueItemDtoValidator : AbstractValidator<BulkUpdateAttributeValueItemDto>
    {
        public BulkUpdateAttributeValueItemDtoValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Attribute value ID is required.");

            RuleFor(x => x.Value)
                .MaximumLength(200).WithMessage("Attribute value cannot exceed 200 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.Value));

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative.")
                .When(x => x.DisplayOrder.HasValue);
        }
    }
}
