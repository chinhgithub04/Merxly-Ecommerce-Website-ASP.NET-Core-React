using FluentValidation;
using merxly.Application.DTOs.Product;
using merxly.Application.Validators.ProductAttribute;
using merxly.Application.Validators.ProductVariant;

namespace merxly.Application.Validators.Product
{
    public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(300).WithMessage("Product name cannot exceed 300 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(5000).WithMessage("Product description cannot exceed 5000 characters.")
                .When(x => !string.IsNullOrWhiteSpace(x.Description));
                
            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("Category is required.");

            RuleFor(x => x.ProductAttributes)
                .NotEmpty().WithMessage("At least one product attribute is required.")
                .Must(attributes => attributes.Count <= 3).WithMessage("A product can have a maximum of 3 attributes.");

            RuleForEach(x => x.ProductAttributes)
                .SetValidator(new CreateProductAttributeDtoValidator());

            RuleFor(x => x.Variants)
                .NotEmpty().WithMessage("At least one product variant is required.");

            RuleForEach(x => x.Variants)
                .SetValidator(new CreateProductVariantDtoValidator());
        }
    }
}
