using merxly.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace merxly.Domain.Entities
{
    public class ApplicationUser : IdentityUser, ICreatedDate, IModifiedDate
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? AvatarPublicId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; }

        // Stripe Integration - for saved payment methods
        public string? StripeCustomerId { get; set; } // Stripe Customer ID for purchasing
        public string? DefaultPaymentMethodId { get; set; } //A specific payment method (card information).

        // Navigation properties
        public Store? Store { get; set; }
        public Cart? Cart { get; set; }
        public Wishlist? Wishlist { get; set; }
        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
