using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.StoreTransfer;
using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using merxly.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class StoreTransferRepository : GenericRepository<StoreTransfer, Guid>, IStoreTransferRepository
    {
        public StoreTransferRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<List<StoreTransfer>> GetByPaymentIdAsync(Guid paymentId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Where(st => st.PaymentId == paymentId)
                .Include(st => st.Store)
                .Include(st => st.SubOrder)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<StoreTransfer>> GetByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Where(st => st.StoreId == storeId)
                .Include(st => st.SubOrder)
                .OrderByDescending(st => st.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<StoreTransfer>> GetBySubOrderIdAsync(Guid subOrderId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Where(st => st.SubOrderId == subOrderId)
                .Include(st => st.Store)
                .ToListAsync(cancellationToken);
        }

        public async Task AddRangeAsync(List<StoreTransfer> transfers, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddRangeAsync(transfers, cancellationToken);
        }

        public async Task<PaginatedResultDto<StoreTransfer>> GetStoreTransactionsAsync(
            Guid storeId,
            StoreTransferFilterDto filter,
            CancellationToken cancellationToken = default)
        {
            var query = _dbSet
                .Where(st => st.StoreId == storeId)
                .Include(st => st.SubOrder)
                    .ThenInclude(so => so.Order)
                .Include(st => st.Payment)
                .AsQueryable();

            // Apply filters
            if (filter.Status.HasValue)
            {
                query = query.Where(st => st.Status == filter.Status.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var searchTerm = filter.SearchTerm.Trim().ToLower();
                query = query.Where(st =>
                    st.SubOrder.SubOrderNumber.ToLower().Contains(searchTerm));
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(st => st.CreatedAt >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                var toDateEndOfDay = filter.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(st => st.CreatedAt <= toDateEndOfDay);
            }

            if (filter.MinAmount.HasValue)
            {
                query = query.Where(st => st.Amount >= filter.MinAmount.Value);
            }

            if (filter.MaxAmount.HasValue)
            {
                query = query.Where(st => st.Amount <= filter.MaxAmount.Value);
            }

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var items = await query
                .OrderByDescending(st => st.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResultDto<StoreTransfer>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<StoreTransfer?> GetStoreTransactionByIdAsync(
            Guid storeId,
            Guid transferId,
            CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Where(st => st.Id == transferId && st.StoreId == storeId)
                .Include(st => st.SubOrder)
                    .ThenInclude(so => so.Order)
                .Include(st => st.Payment)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
