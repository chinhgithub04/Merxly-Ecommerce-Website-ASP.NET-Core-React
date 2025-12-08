using FluentValidation;
using merxly.Application.DTOs.ProductAttribute.Delete;
using merxly.Application.Validators.ProductVariant;

namespace merxly.Application.Validators.ProductAttribute
{
    public class DeleteAttributesWithVariantsDtoValidator : AbstractValidator<DeleteAttributesWithVariantsDto>
    {
        public DeleteAttributesWithVariantsDtoValidator()
        {
            RuleFor(x => x.AttributeIds)
                .NotEmpty().WithMessage("At least one attribute ID is required for deletion.");

            RuleForEach(x => x.AttributeIds)
                .NotEmpty().WithMessage("Attribute ID cannot be empty.");

            // Validate that attribute IDs are unique
            RuleFor(x => x.AttributeIds)
                .Must(ids => ids.Distinct().Count() == ids.Count)
                .WithMessage("Duplicate attribute IDs are not allowed.")
                .When(x => x.AttributeIds.Any());

            RuleFor(x => x.ProductVariants)
                .NotEmpty().WithMessage("At least one product variant is required.");

            RuleForEach(x => x.ProductVariants)
                .SetValidator(new CreateProductVariantDtoValidator());
        }
    }
}
