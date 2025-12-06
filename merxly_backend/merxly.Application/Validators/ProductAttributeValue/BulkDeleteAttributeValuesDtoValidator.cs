using FluentValidation;
using merxly.Application.DTOs.ProductAttributeValue.Delete;

namespace merxly.Application.Validators.ProductAttributeValue
{
    public class BulkDeleteAttributeValuesDtoValidator : AbstractValidator<BulkDeleteAttributeValuesDto>
    {
        public BulkDeleteAttributeValuesDtoValidator()
        {
            RuleFor(x => x.AttributeValueIds)
                .NotEmpty().WithMessage("At least one attribute value ID is required for deletion.");

            RuleForEach(x => x.AttributeValueIds)
                .NotEmpty().WithMessage("Attribute value ID cannot be empty.");

            // Validate that attribute value IDs are unique
            RuleFor(x => x.AttributeValueIds)
                .Must(ids => ids.Distinct().Count() == ids.Count)
                .WithMessage("Duplicate attribute value IDs are not allowed.")
                .When(x => x.AttributeValueIds.Any());
        }
    }
}
