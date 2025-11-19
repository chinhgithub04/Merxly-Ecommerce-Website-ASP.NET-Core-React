using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class Review : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public int Rating { get; set; }
        public string? Title { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public string UserId { get; set; }
        public Guid ProductId { get; set; }
        public Guid OrderId { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; }
        public Product Product { get; set; }
        public Order Order { get; set; }
        public ICollection<ReviewMedia> Medias { get; set; } = new List<ReviewMedia>();
    }
}
