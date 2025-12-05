using FluentValidation;
using merxly.Application.DTOs.ProductVariantMedia.Update;

namespace merxly.Application.Validators.ProductVariantMedia
{
    public class BulkUpdateProductMediaRequestDtoValidator : AbstractValidator<BulkUpdateProductMediaRequestDto>
    {
        public BulkUpdateProductMediaRequestDtoValidator()
        {
            RuleFor(x => x.ProductVariantMedias)
                .NotEmpty().WithMessage("At least one product variant media is required for bulk update.");

            RuleForEach(x => x.ProductVariantMedias)
                .SetValidator(new BulkUpdateVariantMediaWrapperDtoValidator());
        }
    }
}
