namespace merxly.Application.DTOs.Store
{
    public record DetailStoreDto
    {
        public Guid Id { get; init; }
        public string StoreName { get; init; }
        public string? Description { get; init; }
        public string? LogoUrl { get; init; }
        public string? BannerUrl { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string? Website { get; init; }
        public bool IsActive { get; init; }
        public bool IsVerified { get; init; }
        public decimal CommissionRate { get; init; }
        public DateTime CreatedAt { get; init; }
        public string OwnerId { get; init; }
        public string OwnerName { get; init; }
    }
}
