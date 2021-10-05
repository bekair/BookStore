using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using DataAccess.DataAccessImplementations;
using DataAccess.DbContext;
using EntityStore.Base;
using Microsoft.AspNetCore.Identity;
using System;

namespace DataAccess.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BookStoreDbContext _bookStoreDbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public IAddressRepository AddressRepository { get; private set; }
        public IAuthorRepository AuthorRepository { get; private set; }
        public IBookAuthorRepository BookAuthorRepository { get; private set; }
        public IBookDetailRepository BookDetailRepository { get; private set; }
        public IBookForSaleRepository BookForSaleRepository { get; private set; }
        public IBookRepository BookRepository { get; private set; }
        public IBuyerRepository BuyerRepository { get; private set; }
        public IShoppingCartRepository ShoppingCartRepository { get; private set; }
        public IDeliveryRepository DeliveryRepository { get; private set; }
        public IOrderDetailRepository OrderDetailRepository { get; private set; }
        public IOrderRepository OrderRepository { get; private set; }
        public IPaymentRepository PaymentRepository { get; private set; }
        public ISellerRepository SellerRepository { get; private set; }
        public IAppUserRepository AppUserRepository { get; private set; }

        public UnitOfWork(BookStoreDbContext bookStoreDbContext, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _bookStoreDbContext = bookStoreDbContext;
            _userManager = userManager;
            _signInManager = signInManager;

            AppUserRepository = new AppUserRepository(_bookStoreDbContext, _userManager, _signInManager);
            AddressRepository = new AddressRepository(_bookStoreDbContext);
            AuthorRepository = new AuthorRepository(_bookStoreDbContext);
            BookAuthorRepository = new BookAuthorRepository(_bookStoreDbContext);
            BookDetailRepository = new BookDetailRepository(_bookStoreDbContext);
            BookForSaleRepository = new BookForSaleRepository(_bookStoreDbContext);
            BookRepository = new BookRepository(_bookStoreDbContext);
            BuyerRepository = new BuyerRepository(_bookStoreDbContext, _userManager, _signInManager);
            ShoppingCartRepository = new ShoppingCartRepository(_bookStoreDbContext);
            DeliveryRepository = new DeliveryRepository(_bookStoreDbContext);
            OrderDetailRepository = new OrderDetailRepository(_bookStoreDbContext);
            OrderRepository = new OrderRepository(_bookStoreDbContext);
            PaymentRepository = new PaymentRepository(_bookStoreDbContext);
            SellerRepository = new SellerRepository(_bookStoreDbContext, _userManager, _signInManager);
        }

        public void Commit()
        {
            _bookStoreDbContext.SaveChanges();
        }

        public void Dispose()
        {
            _bookStoreDbContext.Dispose();
        }
    }
}
