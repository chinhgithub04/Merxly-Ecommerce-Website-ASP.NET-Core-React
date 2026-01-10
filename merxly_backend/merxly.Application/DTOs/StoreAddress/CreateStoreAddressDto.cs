namespace merxly.Application.DTOs.StoreAddress
{
    public class CreateStoreAddressDto
    {
        public string AddressLine { get; set; }
        public int CityCode { get; set; }
        public string CityName { get; set; }
        public int WardCode { get; set; }
        public string WardName { get; set; }
        public string PostalCode { get; set; }
    }
}
