using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;
using Microsoft.AspNetCore.Identity;
using EntityStore.Base;

namespace DataAccess.DataAccessImplementations
{
    public class SellerRepository : AppUserRepository, ISellerRepository
    {
        public SellerRepository(BookStoreDbContext dbContext, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager) : base(dbContext, userManager, signInManager)
        {
        }

        public void AddNewBookToSeller(Book newBook, BookDetail bookDetail, BookAuthor bookAuthor, BookForSale bookForSale)
        {
            dbContext.Book.Add(newBook);
            dbContext.BookDetail.Add(bookDetail);
            dbContext.BookAuthor.Add(bookAuthor);
            dbContext.BookForSale.Add(bookForSale);
        }
    }
}
