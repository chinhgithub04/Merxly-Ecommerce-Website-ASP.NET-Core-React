using FluentValidation;
using merxly.Application.DTOs.Review;

namespace merxly.Application.Validators.Review
{
    public class CreateReviewMediaDtoValidator : AbstractValidator<CreateReviewMediaDto>
    {
        public CreateReviewMediaDtoValidator()
        {
            RuleFor(x => x.MediaPublicId)
                .NotEmpty().WithMessage("MediaPublicId is required");

            RuleFor(x => x.MediaType)
                .IsInEnum().WithMessage("Invalid MediaType");

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0).WithMessage("DisplayOrder must be non-negative");
        }
    }
}
