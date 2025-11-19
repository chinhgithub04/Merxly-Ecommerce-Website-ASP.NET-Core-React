using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class AddressRepository : GenericRepository<Address, Guid>, IAddressRepository
    {
        public AddressRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
