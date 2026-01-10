namespace merxly.Application.DTOs.Store
{
    public record AdminStoreDetailDto
    {
        public Guid Id { get; init; }
        public string StoreName { get; init; }
        public string? Description { get; init; }
        public string? LogoImagePublicId { get; init; }
        public string? BannerImagePublicId { get; init; }
        public string IdentityCardFrontPublicId { get; init; }
        public string IdentityCardBackPublicId { get; init; }
        public string BussinessLicensePublicId { get; init; }
        public string TaxCode { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string OwnerName { get; init; }
        public string OwnerEmail { get; init; }
        public string? OwnerPhoneNumber { get; init; }
        public string? Website { get; init; }
        public bool IsActive { get; init; }
        public bool IsVerified { get; init; }
        public string Status { get; init; } // "Pending", "Approved", "Rejected"
        public string? RejectionReason { get; init; }
        public decimal CommissionRate { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        public string OwnerId { get; init; }
    }
}
