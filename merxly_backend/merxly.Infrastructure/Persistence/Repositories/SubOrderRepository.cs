using merxly.Application.DTOs.Common;
using merxly.Application.DTOs.CustomerOrders;
using merxly.Application.DTOs.Order;
using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;
using merxly.Domain.Enums;
using merxly.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class SubOrderRepository : GenericRepository<SubOrder, Guid>, ISubOrderRepository
    {
        public SubOrderRepository(ApplicationDbContext db) : base(db)
        {
        }

        public async Task<SubOrder?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Include(so => so.Order)
                    .ThenInclude(o => o.ShippingAddress)
                .Include(so => so.Order)
                    .ThenInclude(o => o.User)
                .Include(so => so.Store)
                    .ThenInclude(s => s.Address)
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv.Product)
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv.VariantAttributeValues)
                            .ThenInclude(vav => vav.ProductAttributeValue)
                                .ThenInclude(pav => pav.ProductAttribute)
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv.Media)
                .Include(so => so.StatusHistory)
                .Include(so => so.StoreTransfers)
                .FirstOrDefaultAsync(so => so.Id == id, cancellationToken);
        }

        public async Task<SubOrder?> GetBySubOrderNumberAsync(string subOrderNumber, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .FirstOrDefaultAsync(so => so.SubOrderNumber == subOrderNumber, cancellationToken);
        }

        public async Task<List<SubOrder>> GetByOrderIdAsync(Guid orderId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Where(so => so.OrderId == orderId)
                .Include(so => so.Store)
                .Include(so => so.OrderItems)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<SubOrder>> GetByStoreIdAsync(Guid storeId, CancellationToken cancellationToken = default)
        {
            return await _dbSet
                .Where(so => so.StoreId == storeId)
                .Include(so => so.Order)
                .Include(so => so.OrderItems)
                .OrderByDescending(so => so.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<PaginatedResultDto<SubOrder>> GetStoreOrdersAsync(
            Guid storeId,
            StoreSubOrderFilterDto filter,
            CancellationToken cancellationToken = default)
        {
            var query = _dbSet
                .Where(so => so.StoreId == storeId && so.Status != OrderStatus.Pending)
                .Include(so => so.Order)
                    .ThenInclude(o => o.ShippingAddress)
                .Include(so => so.Order)
                    .ThenInclude(o => o.User)
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv.Product)
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv.VariantAttributeValues)
                            .ThenInclude(vav => vav.ProductAttributeValue)
                                .ThenInclude(pav => pav.ProductAttribute)
                .AsQueryable();

            // Apply filters
            if (filter.Status.HasValue)
            {
                query = query.Where(so => so.Status == filter.Status.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var searchTerm = filter.SearchTerm.Trim().ToLower();
                query = query.Where(so =>
                    so.SubOrderNumber.ToLower().Contains(searchTerm) ||
                    so.Order.User.FirstName.ToLower().Contains(searchTerm) ||
                    so.Order.User.LastName.ToLower().Contains(searchTerm) ||
                    so.Order.User.Email.ToLower().Contains(searchTerm));
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(so => so.CreatedAt >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                var toDateEndOfDay = filter.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(so => so.CreatedAt <= toDateEndOfDay);
            }

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var items = await query
                .OrderByDescending(so => so.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResultDto<SubOrder>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<PaginatedResultDto<SubOrder>> GetCustomerOrdersAsync(
            string customerId,
            CustomerSubOrderFilterDto filter,
            CancellationToken cancellationToken = default)
        {
            var query = _dbSet
                .Where(so => so.Order.UserId == customerId && so.Status != OrderStatus.Pending)
                .Include(so => so.Order)
                    .ThenInclude(o => o.ShippingAddress)
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv.Product)
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.ProductVariant)
                        .ThenInclude(pv => pv.VariantAttributeValues)
                            .ThenInclude(vav => vav.ProductAttributeValue)
                                .ThenInclude(pav => pav.ProductAttribute)
                .AsQueryable();

            // Apply filters
            if (filter.Status.HasValue)
            {
                query = query.Where(so => so.Status == filter.Status.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var searchTerm = filter.SearchTerm.Trim().ToLower();
                query = query.Where(so =>
                    so.SubOrderNumber.ToLower().Contains(searchTerm));
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(so => so.CreatedAt >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                var toDateEndOfDay = filter.ToDate.Value.Date.AddDays(1).AddTicks(-1);
                query = query.Where(so => so.CreatedAt <= toDateEndOfDay);
            }

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var items = await query
                .OrderByDescending(so => so.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResultDto<SubOrder>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task AddRangeAsync(List<SubOrder> subOrders, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddRangeAsync(subOrders, cancellationToken);
        }
    }
}
