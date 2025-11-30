using FluentValidation;
using merxly.Application.DTOs.Product;

namespace merxly.Application.Validators.Product
{
    public class UpdateProductDtoValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductDtoValidator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(300).WithMessage("Product name cannot exceed 300 characters.")
                .When(x => !string.IsNullOrEmpty(x.Name));

            RuleFor(x => x.Description)
                .MaximumLength(5000).WithMessage("Product description cannot exceed 5000 characters.")
                .When(x => !string.IsNullOrEmpty(x.Description));

        }
    }
}
