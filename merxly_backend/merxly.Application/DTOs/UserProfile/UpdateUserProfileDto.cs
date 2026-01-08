namespace merxly.Application.DTOs.UserProfile
{
    public record UpdateUserProfileDto
    {
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public string? AvatarPublicId { get; init; }
        public string? Email { get; init; }
        public string? PhoneNumber { get; init; }
    }
}
