using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using merxly.Application.Interfaces.Services;
using merxly.Application.Models.FileStorage;
using merxly.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace merxly.Infrastructure.Services
{
    public class CloudinaryService : IFileStorageService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(Cloudinary cloudinary, ILogger<CloudinaryService> logger)
        {
            _cloudinary = cloudinary;
            _logger = logger;
        }

        public async Task<CustomFileUploadResult> UploadImageAsync(IFormFile file, string folderName, ImageType imageType)
        {
            ValidateImage(file);

            _logger.LogInformation("Uploading file {FileName} ({Size} bytes) to folder {FolderName}", file.FileName, file.Length, folderName);

            try
            {
                using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folderName,
                    // Chuẩn hoá ảnh đầu vào
                    Transformation = GetTransformationByType(imageType)
                };

                var result = await _cloudinary.UploadAsync(uploadParams);

                if (result.Error != null)
                {
                    _logger.LogError("Cloudinary upload failed: {Error}", result.Error.Message);
                    throw new InvalidOperationException($"Upload failed: {result.Error.Message}");

                }

                _logger.LogInformation("File uploaded: {Url}", result.SecureUrl);
                return new CustomFileUploadResult
                {
                    PublicId = result.PublicId,
                    OriginalUrl = result.SecureUrl.ToString(),
                };
            }
            catch (Exception ex) when (ex is not InvalidOperationException)
            {
                _logger.LogError(ex, "Error uploading product image");
                throw new InvalidOperationException("Failed to upload file", ex);
            }
        }

        public async Task<CustomFileUploadResult> UploadVideoAsync(IFormFile file, string folderName) 
        { 
            ValidateVideo(file);

            _logger.LogInformation("Uploading file {FileName} ({Size} bytes) to folder {FolderName}", file.FileName, file.Length, folderName);

            try
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folderName,
                    // Free plan không đủ credit để chuẩn hoá video
                };

                var result = await _cloudinary.UploadAsync(uploadParams);
                if (result.Error != null)
                {
                    _logger.LogError("Cloudinary upload failed: {Error}", result.Error.Message);
                    throw new InvalidOperationException($"Upload failed: {result.Error.Message}");
                }

                _logger.LogInformation("File uploaded: {Url}", result.SecureUrl);
                return new CustomFileUploadResult
                {
                    PublicId = result.PublicId,
                    OriginalUrl = result.SecureUrl.ToString(),
                };
            }
            catch (Exception ex) when (ex is not InvalidOperationException)
            {
                _logger.LogError(ex, "Error uploading product video");
                throw new InvalidOperationException("Failed to upload file", ex);
            }
        }

        public async Task DeleteFileAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            if (result.Result != "ok")
            {
                _logger.LogWarning("Cloudinary delete failed for {PublicId}", publicId);
            }
        }

        private void ValidateImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty");
            }

            var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                throw new ArgumentException($"Invalid image type: {file.ContentType}. Allowed: JPEG, PNG, WebP");
            }

            const long maxSize = 10 * 1024 * 1024;
            if (file.Length > maxSize)
            {
                throw new ArgumentException($"Image size {file.Length / 1024 / 1024}MB exceeds 10MB limit");
            }
        }

        private void ValidateVideo(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty");
            }

            var allowedTypes = new[] { "video/mp4", "video/webm" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
            {
                throw new ArgumentException($"Invalid video type: {file.ContentType}. Allowed: MP4, WebM");
            }

            const long maxSize = 50 * 1024 * 1024;
            if (file.Length > maxSize)
            {
                throw new ArgumentException($"Video size {file.Length / 1024 / 1024}MB exceeds 50MB limit");
            }
        }

        private Transformation GetTransformationByType(ImageType type)
        {
            var transformation = new Transformation();

            switch (type)
            {
                case ImageType.Product:
                    return transformation
                        .Width(2000).Height(2000).Crop("limit")
                        .Quality("auto").FetchFormat("auto");

                case ImageType.Avatar:
                    return transformation
                        .Width(500).Height(500).Crop("fill").Gravity("face")
                        .Quality("auto").FetchFormat("auto");

                case ImageType.Banner:
                    return transformation
                        .Width(1920).Crop("scale")
                        .Quality("auto").FetchFormat("auto");

                case ImageType.Logo:
                    return transformation
                        .Width(500).Crop("limit");
                case ImageType.Category:
                    return transformation
                        .Width(600).Height(600).Crop("fill").Gravity("auto")
                        .Quality("auto").FetchFormat("auto");

                default:
                    return transformation.Quality("auto").FetchFormat("auto");
            }
        }
    }
}
