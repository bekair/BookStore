using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;

namespace DataAccess.DataAccessImplementations
{
    public class OrderDetailRepository : BaseRepository<OrderDetail>, IOrderDetailRepository
    {
        public OrderDetailRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}

