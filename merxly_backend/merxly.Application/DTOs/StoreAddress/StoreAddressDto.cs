namespace merxly.Application.DTOs.StoreAddress
{
    public class StoreAddressDto
    {
        public Guid Id { get; set; }
        public string AddressLine { get; set; }
        public int CityCode { get; set; }
        public string CityName { get; set; }
        public int WardCode { get; set; }
        public string WardName { get; set; }
        public string PostalCode { get; set; }
        public string FullAddress { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
