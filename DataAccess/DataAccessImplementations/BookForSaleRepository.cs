using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Common.Enums;

namespace DataAccess.DataAccessImplementations
{
    public class BookForSaleRepository : BaseRepository<BookForSale>, IBookForSaleRepository
    {
        public BookForSaleRepository(BookStoreDbContext dbContext) : base(dbContext)
        {
        }

        public IEnumerable<BookForSale> GetSellerBooksWithAllInformation(string sellerId)
        {
            IEnumerable<BookForSale> bookList = dbEntity.Include(bookForSale => bookForSale.Book)
                                                            .ThenInclude(book => book.BookDetail)
                                                        .Include(bookForSale => bookForSale.Book)
                                                            .ThenInclude(book => book.BookAuthors)
                                                                .ThenInclude(bookAuthor => bookAuthor.Author)
                                                        .Where(bookForSale => bookForSale.SellerId == sellerId)
                                                        .ToList();
            return bookList;
        }

        public IEnumerable<BookForSale> GetAllBooksForSale()
        {
            IEnumerable<BookForSale> allForSaleBooks = dbEntity.Include(bookForSale => bookForSale.Book)
                                                            .ThenInclude(book => book.BookDetail)
                                                        .Include(bookForSale => bookForSale.Book)
                                                            .ThenInclude(book => book.BookAuthors)
                                                                .ThenInclude(bookAuthor => bookAuthor.Author)
                                                        .Where(bookForSale => bookForSale.SaleStatus == SaleState.ForSale)
                                                        .ToList();

            return allForSaleBooks;
        }
    }
}
