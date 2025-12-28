using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class AddressRepository : GenericRepository<Address, Guid>, IAddressRepository
    {
        public AddressRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<List<Address>> GetAddressesByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<Address?> GetAddressByIdAndUserIdAsync(Guid addressId, string userId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId, cancellationToken);
        }

        public async Task<Address?> GetDefaultAddressByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .FirstOrDefaultAsync(a => a.UserId == userId && a.IsDefault, cancellationToken);
        }

        public async Task<bool> HasDefaultAddressAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .AnyAsync(a => a.UserId == userId && a.IsDefault, cancellationToken);
        }

        public async Task UnsetAllDefaultAddressesAsync(string userId, CancellationToken cancellationToken = default)
        {
            var addresses = await _dbSet
                .Where(a => a.UserId == userId && a.IsDefault)
                .ToListAsync(cancellationToken);

            foreach (var address in addresses)
            {
                address.IsDefault = false;
            }
        }
    }
}
