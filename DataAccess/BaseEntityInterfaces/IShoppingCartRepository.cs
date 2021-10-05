using System.Collections.Generic;
using DataAccess.BaseAPI;
using EntityStore.Entity;

namespace DataAccess.BaseEntityInterfaces
{
    public interface IShoppingCartRepository : IRepository<ShoppingCart>
    {
        void AddToShoppingCart(string sellerId, string buyerId, int bookForSaleId, int quantity = 1);
        IEnumerable<ShoppingCart> GetBuyerCartItems(string buyerId); 
    }
}
