using FluentValidation;
using merxly.Application.DTOs.ProductAttributeValue;

namespace merxly.Application.Validators.ProductAttributeValue
{
    public class AttributeValueAdditionDtoValidator : AbstractValidator<AttributeValueAdditionDto>
    {
        public AttributeValueAdditionDtoValidator()
        {
            RuleFor(x => x.ProductAttributeId)
                .NotEmpty().WithMessage("Product attribute ID is required.");

            RuleFor(x => x.AttributeValues)
                .NotEmpty().WithMessage("At least one attribute value is required.");

            RuleForEach(x => x.AttributeValues)
                .SetValidator(new CreateProductAttributeValueDtoValidator());

            // Validate that attribute values are unique
            RuleFor(x => x.AttributeValues)
                .Must(values => values.Select(v => v.Value.Trim().ToLower()).Distinct().Count() == values.Count)
                .WithMessage("Attribute values must be unique.")
                .When(x => x.AttributeValues.Any());
        }
    }
}
