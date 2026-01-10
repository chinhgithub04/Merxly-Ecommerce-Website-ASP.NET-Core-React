namespace merxly.Application.DTOs.Wishlist
{
    public class WishlistItemDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string? ProductImagePublicId { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
        public Guid? ProductVariantId { get; set; }
        public Dictionary<string, string> SelectedAttributes { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }
}
