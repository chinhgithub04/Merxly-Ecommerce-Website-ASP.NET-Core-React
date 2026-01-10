namespace merxly.Application.DTOs.Store
{
    public record StoreListItemDto
    {
        public Guid Id { get; init; }
        public string StoreName { get; init; }
        public string? Description { get; init; }
        public string? LogoImagePublicId { get; set; }
        public string OwnerName { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string TaxCode { get; init; }
        public string? Website { get; set; }
        public string Status { get; init; } // "Pending", "Approved", "Rejected"
        public DateTime CreatedAt { get; init; }
        public string OwnerId { get; init; }
    }
}
