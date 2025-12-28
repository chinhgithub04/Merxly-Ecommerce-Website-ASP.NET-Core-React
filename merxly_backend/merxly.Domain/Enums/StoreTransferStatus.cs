namespace merxly.Domain.Enums
{
    public enum StoreTransferStatus
    {
        Pending,    // Waiting to be transferred
        Processing, // Transfer in progress
        Completed,  // Successfully transferred to store
        Failed,     // Transfer failed
        Cancelled   // Transfer cancelled (e.g., due to refund)
    }
}
