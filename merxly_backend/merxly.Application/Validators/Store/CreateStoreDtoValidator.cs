using FluentValidation;
using merxly.Application.DTOs.Store;

namespace merxly.Application.Validators.Store
{
    public class CreateStoreDtoValidator : AbstractValidator<CreateStoreDto>
    {
        public CreateStoreDtoValidator()
        {
            RuleFor(x => x.StoreName)
                .NotEmpty().WithMessage("Store name is required.")
                .MaximumLength(200).WithMessage("Store name cannot exceed 200 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.")
                .MaximumLength(256).WithMessage("Email cannot exceed 256 characters.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Phone number is required.")
                .Matches(@"(^0[3|5|7|8|9][0-9]{8}$)|(^(1800|1900)[0-9]{4,8}$)")
                .WithMessage("Invalid phone number format.");

            RuleFor(x => x.Website)
                .Must(BeAValidUrl).WithMessage("Invalid website URL.")
                .When(x => !string.IsNullOrEmpty(x.Website));
        }

        private bool BeAValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        }
    }
}
