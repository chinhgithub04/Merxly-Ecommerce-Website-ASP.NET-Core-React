using merxly.Domain.Enums;
using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class ReviewMedia : ICreatedDate
    {
        public Guid Id { get; set; }
        public string Url { get; set; }
        public int DisplayOrder { get; set; }
        public MediaType MediaType { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign Keys
        public Guid ReviewId { get; set; }

        // Navigation properties
        public Review Review { get; set; }
    }
}
