using merxly.Domain.Enums;
using merxly.Domain.Interfaces;

namespace merxly.Domain.Entities
{
    public class ProductVariantMedia : ICreatedDate, IModifiedDate
    {
        public Guid Id { get; set; }
        public string MediaPublicId { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public long? FileSizeInBytes { get; set; }
        public MediaType MediaType { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMain { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public Guid ProductVariantId { get; set; }

        // Navigation properties
        public ProductVariant ProductVariant { get; set; }
    }
}
