using FluentValidation;
using merxly.Application.DTOs.ProductVariant.Delete;

namespace merxly.Application.Validators.ProductVariant
{
    public class BulkDeleteVariantsDtoValidator : AbstractValidator<BulkDeleteVariantsDto>
    {
        public BulkDeleteVariantsDtoValidator()
        {
            RuleFor(x => x.VariantIds)
                .NotEmpty().WithMessage("At least one variant ID is required for deletion.");

            RuleForEach(x => x.VariantIds)
                .NotEmpty().WithMessage("Variant ID cannot be empty.");

            // Validate that variant IDs are unique
            RuleFor(x => x.VariantIds)
                .Must(ids => ids.Distinct().Count() == ids.Count)
                .WithMessage("Duplicate variant IDs are not allowed.")
                .When(x => x.VariantIds.Any());
        }
    }
}
