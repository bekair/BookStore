using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;

namespace DataAccess.DataAccessImplementations
{
    public class DeliveryRepository : BaseRepository<Delivery>, IDeliveryRepository
    {
        public DeliveryRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}

