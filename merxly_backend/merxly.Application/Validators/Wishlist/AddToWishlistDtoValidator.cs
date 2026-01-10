using FluentValidation;
using merxly.Application.DTOs.Wishlist;

namespace merxly.Application.Validators.Wishlist
{
    public class AddToWishlistDtoValidator : AbstractValidator<AddToWishlistDto>
    {
        public AddToWishlistDtoValidator()
        {
            RuleFor(x => x.ProductId)
                .NotEmpty()
                .WithMessage("Product ID is required");
        }
    }
}
