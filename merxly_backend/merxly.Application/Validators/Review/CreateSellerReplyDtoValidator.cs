using FluentValidation;
using merxly.Application.DTOs.Review;

namespace merxly.Application.Validators.Review
{
    public class CreateSellerReplyDtoValidator : AbstractValidator<CreateSellerReplyDto>
    {
        public CreateSellerReplyDtoValidator()
        {
            RuleFor(x => x.SellerReply)
                .NotEmpty().WithMessage("Seller reply is required")
                .MaximumLength(500).WithMessage("Seller reply cannot exceed 500 characters");
        }
    }
}
