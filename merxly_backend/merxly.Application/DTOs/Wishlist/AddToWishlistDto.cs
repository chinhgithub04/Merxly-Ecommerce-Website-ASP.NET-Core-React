namespace merxly.Application.DTOs.Wishlist
{
    public class AddToWishlistDto
    {
        public Guid ProductId { get; set; }
        public Guid? ProductVariantId { get; set; }
    }
}
