using FluentValidation;
using merxly.Application.DTOs.ProductAttributeValue;

namespace merxly.Application.Validators.ProductAttributeValue
{
    public class UpdateProductAttributeValueDtoValidator : AbstractValidator<UpdateProductAttributeValueDto>
    {
        public UpdateProductAttributeValueDtoValidator()
        {
            RuleFor(x => x.Value)
                .MaximumLength(200).WithMessage("Attribute value cannot exceed 200 characters.")
                .When(x => x.Value != null);
        }
    }
}
