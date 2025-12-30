namespace merxly.Application.DTOs.Cart
{
    public class CartItemDto
    {
        public Guid Id { get; set; }
        public Guid ProductVariantId { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string? ProductImagePublicId { get; set; }
        public decimal PriceAtAdd { get; set; }
        public int Quantity { get; set; }
        public int StockQuantity { get; set; }
        public bool IsAvailable { get; set; }
        public Dictionary<string, string> SelectedAttributes { get; set; } = new();

        // Store Information
        public Guid StoreId { get; set; }
        public string StoreName { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
