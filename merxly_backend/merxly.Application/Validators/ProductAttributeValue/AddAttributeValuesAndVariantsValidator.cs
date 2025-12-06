using FluentValidation;
using merxly.Application.DTOs.ProductAttributeValue;
using merxly.Application.Validators.ProductVariant;

namespace merxly.Application.Validators.ProductAttributeValue
{
    public class AddAttributeValuesAndVariantsValidator : AbstractValidator<AddAttributeValuesAndVariants>
    {
        public AddAttributeValuesAndVariantsValidator()
        {
            RuleFor(x => x.AttributeValueAdditions)
                .NotEmpty().WithMessage("At least one attribute value addition is required.");

            RuleForEach(x => x.AttributeValueAdditions)
                .SetValidator(new AttributeValueAdditionDtoValidator());

            RuleFor(x => x.ProductVariants)
                .NotEmpty().WithMessage("At least one product variant is required.");

            RuleForEach(x => x.ProductVariants)
                .SetValidator(new CreateProductVariantDtoValidator());

            // Validate that ProductAttributeIds are unique
            RuleFor(x => x.AttributeValueAdditions)
                .Must(additions => additions.Select(a => a.ProductAttributeId).Distinct().Count() == additions.Count)
                .WithMessage("Each attribute can only be updated once per request.")
                .When(x => x.AttributeValueAdditions.Any());
        }
    }
}
