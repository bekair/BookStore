using System.Collections.Generic;
using DataAccess.BaseAPI;
using EntityStore.Entity;

namespace DataAccess.BaseEntityInterfaces
{
    public interface IBookForSaleRepository : IRepository<BookForSale>
    {
        IEnumerable<BookForSale> GetSellerBooksWithAllInformation(string sellerId);
        IEnumerable<BookForSale> GetAllBooksForSale();
    }
}
