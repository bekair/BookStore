using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using DataAccess.DbContext;
using EntityStore.Entity;

namespace DataAccess.DataAccessImplementations
{
    public class AuthorRepository : BaseRepository<Author>, IAuthorRepository
    {
        public AuthorRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
