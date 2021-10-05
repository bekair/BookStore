using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.DataAccessImplementations
{
    public class BookRepository : BaseRepository<Book>, IBookRepository
    {
        public BookRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}

