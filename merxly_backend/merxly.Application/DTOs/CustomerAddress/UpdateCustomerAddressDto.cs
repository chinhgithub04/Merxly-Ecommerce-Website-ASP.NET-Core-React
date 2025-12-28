namespace merxly.Application.DTOs.CustomerAddress
{
    public class UpdateCustomerAddressDto
    {
        public string? FullName { get; set; }
        public string? Title { get; set; }
        public string? AddressLine { get; set; }
        public int? CityCode { get; set; }
        public string? CityName { get; set; }
        public int? WardCode { get; set; }
        public string? WardName { get; set; }
        public string? PostalCode { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? IsDefault { get; set; }
    }
}
