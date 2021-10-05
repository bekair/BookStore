using DataAccess.BaseEntityInterfaces;
using System;

namespace DataAccess.BaseAPI
{
    public interface IUnitOfWork : IDisposable
    {
        IAppUserRepository AppUserRepository { get; }
        IAddressRepository AddressRepository { get; }
        IAuthorRepository AuthorRepository { get; }
        IBookAuthorRepository BookAuthorRepository { get; }
        IBookDetailRepository BookDetailRepository { get; }
        IBookForSaleRepository BookForSaleRepository { get; }
        IBookRepository BookRepository { get; }
        IBuyerRepository BuyerRepository { get; }
        IShoppingCartRepository ShoppingCartRepository { get; }
        IDeliveryRepository DeliveryRepository { get; }
        IOrderDetailRepository OrderDetailRepository { get; }
        IOrderRepository OrderRepository { get; }
        IPaymentRepository PaymentRepository { get; }
        ISellerRepository SellerRepository { get; }
        void Commit();
    }
}
