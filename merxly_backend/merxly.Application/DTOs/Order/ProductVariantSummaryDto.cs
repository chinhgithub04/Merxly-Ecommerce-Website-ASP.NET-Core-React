namespace merxly.Application.DTOs.Order
{
    public class ProductVariantSummaryDto
    {
        public Guid Id { get; set; }
        public string SKU { get; set; }
        public string ProductName { get; set; }
        public List<string> AttributeValues { get; set; } = new List<string>();
        public string? MainMediaUrl { get; set; }
    }
}
