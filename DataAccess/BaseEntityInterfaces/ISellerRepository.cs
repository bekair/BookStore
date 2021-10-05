using DataAccess.BaseAPI;
using EntityStore.Entity;

namespace DataAccess.BaseEntityInterfaces
{
    public interface ISellerRepository : IAppUserRepository
    {
        void AddNewBookToSeller(Book newBook, BookDetail bookDetail, BookAuthor bookAuthor, BookForSale bookForSale);
    }
}
