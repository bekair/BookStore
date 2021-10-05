using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;

namespace DataAccess.DataAccessImplementations
{
    public class BookAuthorRepository : BaseRepository<BookAuthor>, IBookAuthorRepository
    {
        public BookAuthorRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
