namespace merxly.Application.DTOs.StorePayment
{
    public class CreateConnectAccountDto
    {
        public string Country { get; set; } = "US";
        public string Email { get; set; }
        public string BusinessType { get; set; } = "individual";
    }
}
