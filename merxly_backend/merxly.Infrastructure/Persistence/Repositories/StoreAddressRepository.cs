using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class StoreAddressRepository : GenericRepository<StoreAddress, Guid>, IStoreAddressRepository
    {
        public StoreAddressRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
