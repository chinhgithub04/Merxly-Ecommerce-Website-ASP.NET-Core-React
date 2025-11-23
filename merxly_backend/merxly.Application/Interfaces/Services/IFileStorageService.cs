using merxly.Application.Models.FileStorage;
using merxly.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace merxly.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        Task<CustomFileUploadResult> UploadImageAsync(IFormFile file, string folderName, ImageType imageType);
        Task<CustomFileUploadResult> UploadVideoAsync(IFormFile file, string folderName);
        Task DeleteFileAsync(string publicId);
    }
}
