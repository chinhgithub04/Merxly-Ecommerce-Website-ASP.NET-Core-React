using merxly.Domain.Enums;

namespace merxly.Application.DTOs.Review
{
    public record CreateReviewMediaDto
    {
        public string MediaPublicId { get; init; }
        public int DisplayOrder { get; init; }
        public MediaType MediaType { get; init; }
    }
}
