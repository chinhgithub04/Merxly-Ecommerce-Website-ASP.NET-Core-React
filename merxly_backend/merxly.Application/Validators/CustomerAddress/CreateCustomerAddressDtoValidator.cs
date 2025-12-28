using FluentValidation;
using merxly.Application.DTOs.CustomerAddress;

namespace merxly.Application.Validators.CustomerAddress
{
    public class CreateCustomerAddressDtoValidator : AbstractValidator<CreateCustomerAddressDto>
    {
        public CreateCustomerAddressDtoValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required")
                .MaximumLength(200).WithMessage("Full name must not exceed 200 characters");

            RuleFor(x => x.Title)
                .MaximumLength(100).WithMessage("Title must not exceed 100 characters");

            RuleFor(x => x.AddressLine)
                .NotEmpty().WithMessage("Address line is required")
                .MaximumLength(200).WithMessage("Address line must not exceed 200 characters");

            RuleFor(x => x.CityCode)
                .GreaterThan(0).WithMessage("City code is required");

            RuleFor(x => x.CityName)
                .NotEmpty().WithMessage("City name is required")
                .MaximumLength(300).WithMessage("City name must not exceed 300 characters");

            RuleFor(x => x.WardCode)
                .GreaterThan(0).WithMessage("Ward code is required");

            RuleFor(x => x.WardName)
                .NotEmpty().WithMessage("Ward name is required")
                .MaximumLength(300).WithMessage("Ward name must not exceed 300 characters");

            RuleFor(x => x.PostalCode)
                .NotEmpty().WithMessage("Postal code is required")
                .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters");

            RuleFor(x => x.PhoneNumber)
                .Matches(@"(^0[3|5|7|8|9][0-9]{8}$)")
                .When(x => !string.IsNullOrEmpty(x.PhoneNumber))
                .WithMessage("Invalid phone number format.");
        }
    }
}
