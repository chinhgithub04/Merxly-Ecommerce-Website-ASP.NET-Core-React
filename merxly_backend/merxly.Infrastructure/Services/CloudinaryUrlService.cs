using CloudinaryDotNet;
using merxly.Application.Interfaces.Services;

namespace merxly.Infrastructure.Services
{
    public class CloudinaryUrlService : ICloudinaryUrlService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryUrlService(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        public string? GetOriginalImageUrl(string? publicId)
        {
            if (string.IsNullOrEmpty(publicId))
                return null;

            return _cloudinary.Api.UrlImgUp
                .Transform(new Transformation()
                    .Quality("auto")
                    .FetchFormat("auto"))
                .BuildUrl(publicId);
        }

        public string? GetThumbnailImageUrl(string? publicId)
        {
            if (string.IsNullOrEmpty(publicId))
                return null;

            return _cloudinary.Api.UrlImgUp
                .Transform(new Transformation()
                    .Width(200).Height(200).Crop("fill")
                    .Quality("auto")
                    .FetchFormat("auto"))
                .BuildUrl(publicId);
        }

        public string? GetMediumImageUrl(string? publicId)
        {
            if (string.IsNullOrEmpty(publicId))
                return null;

            return _cloudinary.Api.UrlImgUp
                .Transform(new Transformation()
                    .Width(600).Height(600).Crop("limit")
                    .Quality("auto")
                    .FetchFormat("auto"))
                .BuildUrl(publicId);
        }

        public string? GetLargeImageUrl(string? publicId)
        {
            if (string.IsNullOrEmpty(publicId))
                return null;

            return _cloudinary.Api.UrlImgUp
                .Transform(new Transformation()
                    .Width(1200).Height(1200).Crop("limit")
                    .Quality("auto")
                    .FetchFormat("auto"))
                .BuildUrl(publicId);
        }

        public string? GetVideoUrl(string? publicId)
        {
            if (string.IsNullOrEmpty(publicId))
                return null;

            return _cloudinary.Api.UrlVideoUp.BuildUrl(publicId);
        }
    }
}
