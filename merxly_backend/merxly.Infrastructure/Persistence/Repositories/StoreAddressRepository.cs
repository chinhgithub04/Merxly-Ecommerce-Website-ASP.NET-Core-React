using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class StoreAddressRepository : GenericRepository<StoreAddress, Guid>, IStoreAddressRepository
    {
        public StoreAddressRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<StoreAddress?> GetByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .FirstOrDefaultAsync(sa => sa.StoreId == storeId, cancellationToken);
        }
    }
}
