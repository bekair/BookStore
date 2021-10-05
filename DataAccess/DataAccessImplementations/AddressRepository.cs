using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using DataAccess.DbContext;
using EntityStore.Entity;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.DataAccessImplementations
{
    public class AddressRepository : BaseRepository<Address>, IAddressRepository
    {
        public AddressRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }

        public IEnumerable<Address> GetAddressInformationByUserId(string userId)
        {
            return dbEntity.Where(address => address.AppUserId == userId)
                           .ToList();
        }

    }
}
