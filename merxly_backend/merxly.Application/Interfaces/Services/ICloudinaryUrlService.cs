namespace merxly.Application.Interfaces.Services
{
    public interface ICloudinaryUrlService
    {
        string? GetOriginalImageUrl(string? publicId);
        string? GetThumbnailImageUrl(string? publicId);
        string? GetMediumImageUrl(string? publicId);
        string? GetLargeImageUrl(string? publicId);
        string? GetVideoUrl(string? publicId);
    }
}
