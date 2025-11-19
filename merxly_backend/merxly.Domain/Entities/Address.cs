using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Address : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string City { get; set; }
        public string StateProvince { get; set; }
        public string PostalCode { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public string UserId { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; }
    }
}
