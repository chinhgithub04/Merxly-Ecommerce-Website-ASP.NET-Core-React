namespace merxly.Application.DTOs.Order
{
    public record StoreOrderItemDto
    {
        public Guid Id { get; init; }
        public int Quantity { get; init; }
        public decimal UnitPrice { get; init; }
        public decimal TotalPrice { get; init; }
        public Guid? ProductVariantId { get; init; }
        public ProductVariantSummaryDto? ProductVariant { get; init; }
    }
}
