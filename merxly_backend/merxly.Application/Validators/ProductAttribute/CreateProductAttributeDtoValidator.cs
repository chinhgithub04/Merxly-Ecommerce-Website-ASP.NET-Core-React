using FluentValidation;
using merxly.Application.DTOs.ProductAttribute;

namespace merxly.Application.Validators.ProductAttribute
{
    public class CreateProductAttributeDtoValidator : AbstractValidator<CreateProductAttributeDto>
    {
        public CreateProductAttributeDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Attribute name is required.")
                .MaximumLength(100).WithMessage("Attribute name cannot exceed 100 characters.");

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative.");

            RuleFor(x => x.ProductAttributeDisplayType)
                .IsInEnum().WithMessage("Invalid display type.");
        }
    }
}
