using FluentValidation;
using merxly.Application.DTOs.CustomerAddress;

namespace merxly.Application.Validators.CustomerAddress
{
    public class UpdateCustomerAddressDtoValidator : AbstractValidator<UpdateCustomerAddressDto>
    {
        public UpdateCustomerAddressDtoValidator()
        {
            RuleFor(x => x.FullName)
                .MaximumLength(200).WithMessage("Full name must not exceed 200 characters")
                .When(x => x.FullName != null);

            RuleFor(x => x.Title)
                .MaximumLength(100).WithMessage("Title must not exceed 100 characters")
                .When(x => x.Title != null);

            RuleFor(x => x.AddressLine)
                .MaximumLength(200).WithMessage("Address line must not exceed 200 characters")
                .When(x => x.AddressLine != null);

            RuleFor(x => x.CityCode)
                .GreaterThan(0).WithMessage("City code must be greater than 0")
                .When(x => x.CityCode.HasValue);

            RuleFor(x => x.CityName)
                .NotEmpty().WithMessage("City name cannot be empty")
                .MaximumLength(300).WithMessage("City name must not exceed 300 characters")
                .When(x => x.CityName != null);

            RuleFor(x => x.WardCode)
                .GreaterThan(0).WithMessage("Ward code must be greater than 0")
                .When(x => x.WardCode.HasValue);

            RuleFor(x => x.WardName)
                .NotEmpty().WithMessage("Ward name cannot be empty")
                .MaximumLength(300).WithMessage("Ward name must not exceed 300 characters")
                .When(x => x.WardName != null);

            RuleFor(x => x.PostalCode)
                .NotEmpty().WithMessage("Postal code cannot be empty")
                .MaximumLength(20).WithMessage("Postal code must not exceed 20 characters")
                .When(x => x.PostalCode != null);

            RuleFor(x => x.PhoneNumber)
                .Matches(@"(^0[3|5|7|8|9][0-9]{8}$)")
                .When(x => !string.IsNullOrEmpty(x.PhoneNumber))
                .WithMessage("Invalid phone number format.");
        }
    }
}
