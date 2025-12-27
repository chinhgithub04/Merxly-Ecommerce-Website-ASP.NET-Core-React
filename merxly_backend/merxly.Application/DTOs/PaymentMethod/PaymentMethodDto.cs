namespace merxly.Application.DTOs.PaymentMethod
{
    public class PaymentMethodDto
    {
        public string Id { get; set; }
        public string Type { get; set; } // e.g., card, apple_pay, etc.
        public CardDetailsDto? Card { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CardDetailsDto
    {
        public string Brand { get; set; } // Visa, MasterCard, etc.
        public string Last4 { get; set; }
        public int ExpMonth { get; set; }
        public int ExpYear { get; set; }
    }
}
