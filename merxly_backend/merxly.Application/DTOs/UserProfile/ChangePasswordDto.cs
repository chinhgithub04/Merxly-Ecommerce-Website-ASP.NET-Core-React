namespace merxly.Application.DTOs.UserProfile
{
    public record ChangePasswordDto
    {
        public string CurrentPassword { get; init; }
        public string NewPassword { get; init; }
        public string ConfirmNewPassword { get; init; }
    }
}
