using FluentValidation;
using merxly.Application.DTOs.ProductAttribute;

namespace merxly.Application.Validators.ProductAttribute
{
    public class UpdateProductAttributeDtoValidator : AbstractValidator<UpdateProductAttributeDto>
    {
        public UpdateProductAttributeDtoValidator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(100).WithMessage("Attribute name cannot exceed 100 characters.")
                .When(x => x.Name != null);

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative.")
                .When(x => x.DisplayOrder.HasValue);

            RuleFor(x => x.ProductAttributeDisplayType)
                .IsInEnum().WithMessage("Invalid display type.")
                .When(x => x.ProductAttributeDisplayType.HasValue);
        }
    }
}
