using FluentValidation;
using merxly.Application.DTOs.ProductAttributeValue;

namespace merxly.Application.Validators.ProductAttributeValue
{
    public class CreateProductAttributeValueDtoValidator : AbstractValidator<CreateProductAttributeValueDto>
    {
        public CreateProductAttributeValueDtoValidator()
        {
            RuleFor(x => x.Value)
                .NotEmpty().WithMessage("Attribute value is required.")
                .MaximumLength(200).WithMessage("Attribute value cannot exceed 200 characters.");

            RuleFor(x => x.ProductAttributeId)
                .NotEmpty().WithMessage("Product attribute is required.");
        }
    }
}
