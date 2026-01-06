using FluentValidation;
using merxly.Application.DTOs.Review;

namespace merxly.Application.Validators.Review
{
    public class CreateReviewDtoValidator : AbstractValidator<CreateReviewDto>
    {
        public CreateReviewDtoValidator()
        {
            RuleFor(x => x.OrderItemId)
                .NotEmpty().WithMessage("OrderItemId is required");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

            RuleFor(x => x.Comment)
                .MaximumLength(1000).WithMessage("Comment cannot exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Comment));

            RuleFor(x => x.Medias)
                .Must(medias => medias == null || medias.Count <= 10)
                .WithMessage("Cannot upload more than 10 media files");

            RuleForEach(x => x.Medias)
                .SetValidator(new CreateReviewMediaDtoValidator())
                .When(x => x.Medias != null);
        }
    }
}
