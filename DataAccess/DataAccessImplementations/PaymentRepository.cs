using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;

namespace DataAccess.DataAccessImplementations
{
    public class PaymentRepository : BaseRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
