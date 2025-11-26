using FluentValidation;
using merxly.Application.DTOs.Category;

namespace merxly.Application.Validators.Category
{
    public class UpdateCategoryDtoValidator : AbstractValidator<UpdateCategoryDto>
    {
        public UpdateCategoryDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Category name is required.")
                .MaximumLength(200).WithMessage("Category name must not exceed 200 characters.")
                .When(x => !string.IsNullOrEmpty(x.Name));

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.ImagePublicId)
                .MaximumLength(500).WithMessage("ImagePublicId must not exceed 500 characters.")
                .When(x => !string.IsNullOrEmpty(x.ImagePublicId));
        }
    }
}