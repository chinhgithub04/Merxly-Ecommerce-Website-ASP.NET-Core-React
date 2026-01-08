namespace merxly.Application.DTOs.UserProfile
{
    public record UserProfileDto
    {
        public string Id { get; init; }
        public string FirstName { get; init; }
        public string LastName { get; init; }
        public string? AvatarPublicId { get; init; }
        public string Email { get; init; }
        public string? PhoneNumber { get; init; }
        public bool IsActive { get; init; }
        public int TotalOrders { get; init; }
        public int PendingOrders { get; init; }
        public int CompletedOrders { get; init; }
    }
}
