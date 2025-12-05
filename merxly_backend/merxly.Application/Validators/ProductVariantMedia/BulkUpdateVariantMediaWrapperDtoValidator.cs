using FluentValidation;
using merxly.Application.DTOs.ProductVariantMedia.Update;

namespace merxly.Application.Validators.ProductVariantMedia
{
    public class BulkUpdateVariantMediaWrapperDtoValidator : AbstractValidator<BulkUpdateVariantMediaWrapperDto>
    {
        public BulkUpdateVariantMediaWrapperDtoValidator()
        {
            RuleFor(x => x.ProductVariantId)
                .NotEmpty().WithMessage("Product variant ID is required.");

            RuleFor(x => x.VariantMedias)
                .NotEmpty().WithMessage("At least one variant media is required.");

            RuleForEach(x => x.VariantMedias)
                .SetValidator(new BulkUpdateVariantMediaItemDtoValidator());
        }
    }
}
