using merxly.Application.DTOs.Auth;

namespace merxly.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto, CancellationToken cancellationToken);
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto, CancellationToken cancellationToken);
        Task<LoginResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken);
        Task RevokeTokenAsync(string refreshToken, CancellationToken cancellationToken);
    }
}
