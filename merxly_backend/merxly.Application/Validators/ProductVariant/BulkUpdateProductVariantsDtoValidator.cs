using FluentValidation;
using merxly.Application.DTOs.ProductVariant.Update;

namespace merxly.Application.Validators.ProductVariant
{
    public class BulkUpdateProductVariantsDtoValidator : AbstractValidator<BulkUpdateProductVariantsDto>
    {
        public BulkUpdateProductVariantsDtoValidator()
        {
            RuleFor(x => x.UpdatedVariants)
                .NotEmpty().WithMessage("At least one variant is required for bulk update.");

            RuleForEach(x => x.UpdatedVariants)
                .SetValidator(new BulkUpdateVariantItemDtoValidator());
        }
    }
}
