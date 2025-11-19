using merxly.Domain.Entities;

namespace merxly.Application.Interfaces.Repositories
{
    public interface IPaymentRepository : IGenericRepository<Payment, Guid>
    {
    }
}
