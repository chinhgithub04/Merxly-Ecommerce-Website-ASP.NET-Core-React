using merxly.Application.Interfaces.Repositories;
using merxly.Domain.Entities;

namespace merxly.Infrastructure.Persistence.Repositories
{
    public class ReviewMediaRepository : GenericRepository<ReviewMedia, Guid>, IReviewMediaRepository
    {
        public ReviewMediaRepository(ApplicationDbContext db) : base(db)
        {
        }
    }
}
