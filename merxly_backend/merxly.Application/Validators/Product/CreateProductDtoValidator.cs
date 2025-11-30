using FluentValidation;
using merxly.Application.DTOs.Product;

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
                .MaximumLength(5000).WithMessage("Product description cannot exceed 5000 characters.");
                
            RuleFor(x => x.CategoryId)
                .NotEmpty().WithMessage("Category is required.");
        }
    }
}
