using FluentValidation;
using merxly.Application.DTOs.ProductVariantMedia.Update;

namespace merxly.Application.Validators.ProductVariantMedia
{
    public class BulkUpdateVariantMediaItemDtoValidator : AbstractValidator<BulkUpdateVariantMediaItemDto>
    {
        public BulkUpdateVariantMediaItemDtoValidator()
        {
            // For new media items (Id is null), MediaPublicId and MediaType are required
            RuleFor(x => x.MediaPublicId)
                .NotEmpty().WithMessage("Media public ID is required for new media items.")
                .MaximumLength(500).WithMessage("Media public ID cannot exceed 500 characters.")
                .When(x => !x.Id.HasValue);

            RuleFor(x => x.MediaType)
                .NotNull().WithMessage("Media type is required for new media items.")
                .IsInEnum().WithMessage("Invalid media type.")
                .When(x => !x.Id.HasValue);

            // For existing media items (Id is not null), MediaPublicId is optional but must be valid if provided
            RuleFor(x => x.MediaPublicId)
                .MaximumLength(500).WithMessage("Media public ID cannot exceed 500 characters.")
                .When(x => x.Id.HasValue && !string.IsNullOrWhiteSpace(x.MediaPublicId));

            RuleFor(x => x.MediaType)
                .IsInEnum().WithMessage("Invalid media type.")
                .When(x => x.Id.HasValue && x.MediaType.HasValue);

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative.")
                .When(x => x.DisplayOrder.HasValue);
        }
    }
}
