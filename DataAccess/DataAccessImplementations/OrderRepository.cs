using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;

namespace DataAccess.DataAccessImplementations
{
    public class OrderRepository : BaseRepository<Order>, IOrderRepository
    {
        public OrderRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
