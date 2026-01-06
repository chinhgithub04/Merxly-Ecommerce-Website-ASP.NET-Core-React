using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Review
{
    public record ReviewMediaDto
    {
        public Guid Id { get; init; }
        public string MediaPublicId { get; init; }
        public int DisplayOrder { get; init; }
        public MediaType MediaType { get; init; }
    }
}
