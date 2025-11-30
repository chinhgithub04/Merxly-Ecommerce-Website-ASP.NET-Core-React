using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class StoreRepository : GenericRepository<Store, Guid>, IStoreRepository
    {
        public StoreRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<Guid?> GetStoreIdByOwnerIdAsync(string ownerId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Where(s => s.OwnerId == ownerId)
                .Select(s => s.Id)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
