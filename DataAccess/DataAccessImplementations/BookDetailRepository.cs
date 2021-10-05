﻿using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;

namespace DataAccess.DataAccessImplementations
{
    public class BookDetailRepository : BaseRepository<BookDetail>, IBookDetailRepository
    {
        public BookDetailRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }
    }
}
