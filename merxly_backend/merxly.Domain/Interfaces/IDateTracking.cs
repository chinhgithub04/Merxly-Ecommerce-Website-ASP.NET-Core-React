namespace merxly.Domain.Interfaces
{
    public interface ICreatedDate
    {
        DateTime CreatedAt { get; set; }
    }

    public interface IModifiedDate
    {
        DateTime? UpdatedAt { get; set; }
    }
}
