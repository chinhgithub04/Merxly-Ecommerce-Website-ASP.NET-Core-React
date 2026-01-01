namespace merxly.Domain.Enums
{
    public enum OrderStatus
    {
        Pending = 0,
        Confirmed = 1,
        Processing = 2,
        Delivering = 3,
        Shipped = 4,
        Completed = 5,
        Cancelled = 6,
        Refunded = 7,
        Failed = 8
    }
}
