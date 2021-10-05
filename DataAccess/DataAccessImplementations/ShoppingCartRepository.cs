using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;
using System.Linq;
using DataAccess.Result;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.DataAccessImplementations
{
    public class ShoppingCartRepository : BaseRepository<ShoppingCart>, IShoppingCartRepository
    {
        public ShoppingCartRepository(BookStoreDbContext dbContext)
            : base(dbContext)
        {
        }

        public void AddToShoppingCart(string sellerId, string buyerId, int bookForSaleId, int quantity = 1)
        {
            int currentDbQuantity = dbContext.BookForSale.Where(bookForSale => bookForSale.Id == bookForSaleId)
                                                         .Select(bookForSale => bookForSale.Quantity)
                                                         .FirstOrDefault();

            if (currentDbQuantity >= quantity)
            {
                bool isExistsInCart = dbEntity.Local.Any(cartItem => cartItem.BookForSaleId == bookForSaleId
                                                                                      && cartItem.BuyerId == buyerId
                                                                   );
                BookForSale updatedBookForSale = dbContext.BookForSale.Where(bookForSale => bookForSale.Id == bookForSaleId)
                                                                      .FirstOrDefault();
                updatedBookForSale.Quantity -= quantity;
                if (isExistsInCart)
                {
                    ShoppingCart updatedCartItem = dbEntity.Where(cartItem => cartItem.BookForSaleId == bookForSaleId
                                                                                 && cartItem.BuyerId == buyerId
                                                           )
                                                           .FirstOrDefault();

                    updatedCartItem.Quantity += quantity;
                    dbEntity.Update(updatedCartItem);
                    dbContext.BookForSale.Update(updatedBookForSale);
                }
                else
                {
                    ShoppingCart newShoppingCart = new ShoppingCart
                    {
                        BookForSale = updatedBookForSale,
                        BookForSaleId = bookForSaleId,
                        BuyerId = buyerId,
                        Quantity = quantity
                    };

                    Insert(newShoppingCart);
                    dbContext.BookForSale.Update(updatedBookForSale);
                }
            }
            else
            {
                throw new Exception("There are not enough number of books to add the cart!");
            }
        }

        public IEnumerable<ShoppingCart> GetBuyerCartItems(string buyerId)
        {
            return dbEntity.Include(shoppingCart => shoppingCart.BookForSale)
                                .ThenInclude(bookForSale => bookForSale.Book)
                                    .ThenInclude(book => book.BookDetail)
                            .Include(shoppingCart => shoppingCart.BookForSale)
                                .ThenInclude(bookForSale => bookForSale.Book)
                                    .ThenInclude(book => book.BookAuthors)
                                        .ThenInclude(bookAuthors => bookAuthors.Author)
                           .Where(shoppingCart => shoppingCart.BuyerId == buyerId)
                           .ToList();
        }
    }
}

