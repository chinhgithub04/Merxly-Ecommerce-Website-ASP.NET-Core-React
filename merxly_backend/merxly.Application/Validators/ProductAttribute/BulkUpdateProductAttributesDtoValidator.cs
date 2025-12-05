using FluentValidation;
using merxly.Application.DTOs.ProductAttribute.Update;

namespace merxly.Application.Validators.ProductAttribute
{
    public class BulkUpdateProductAttributesDtoValidator : AbstractValidator<BulkUpdateProductAttributesDto>
    {
        public BulkUpdateProductAttributesDtoValidator()
        {
            RuleFor(x => x.Attributes)
                .NotEmpty().WithMessage("At least one attribute is required for bulk update.");

            RuleForEach(x => x.Attributes)
                .SetValidator(new BulkUpdateAttributeItemDtoValidator());
        }
    }
}
