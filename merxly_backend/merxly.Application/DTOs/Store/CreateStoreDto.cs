namespace merxly.Application.DTOs.Store
{
    public record CreateStoreDto
    {
        public string StoreName { get; init; }
        public string? Description { get; init; }
        public string Email { get; init; }
        public string PhoneNumber { get; init; }
        public string? Website { get; init; }
    }
}
