using FluentValidation;
using merxly.Application.DTOs.ProductAttributeValue.Update;

namespace merxly.Application.Validators.ProductAttributeValue
{
    public class BulkUpdateProductAttributeValuesDtoValidator : AbstractValidator<BulkUpdateProductAttributeValuesDto>
    {
        public BulkUpdateProductAttributeValuesDtoValidator()
        {
            RuleFor(x => x.AttributeValues)
                .NotEmpty().WithMessage("At least one attribute value is required for bulk update.");

            RuleForEach(x => x.AttributeValues)
                .SetValidator(new BulkUpdateAttributeValueItemDtoValidator());
        }
    }
}
