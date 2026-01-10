namespace merxly.Application.DTOs.Wishlist
{
    public class WishlistDto
    {
        public Guid Id { get; set; }
        public List<WishlistItemDto> WishlistItems { get; set; } = new();
        public int TotalItems { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
