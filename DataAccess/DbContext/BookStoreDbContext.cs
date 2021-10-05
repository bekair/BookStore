using Common.Enums;
using EntityStore.Base;
using EntityStore.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.DbContext
{
    public class BookStoreDbContext : IdentityDbContext
    {
        public BookStoreDbContext(DbContextOptions options) : base(options) { }

        public BookStoreDbContext() : base() { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            /* Composite key creation. Uniqueness can be provided by the composition of 
               BookId and AuthorId rows in the BookAuthor table.
            */
            builder.Entity<BookAuthor>()
                .HasKey(bookAuthor => new { bookAuthor.BookId, bookAuthor.AuthorId });

            // Many-to-Many Relationship between Book and Author
            builder.Entity<BookAuthor>()
                .HasOne(bookAuthor => bookAuthor.Author)
                .WithMany(author => author.BookAuthors)
                .HasForeignKey(bookAuthor => bookAuthor.AuthorId);

            builder.Entity<BookAuthor>()
                .HasOne(bookAuthor => bookAuthor.Book)
                .WithMany(book => book.BookAuthors)
                .HasForeignKey(bookAuthor => bookAuthor.BookId);

            // One-to-Many Relationship between Seller and BookForSale
            builder.Entity<BookForSale>()
                .HasOne(bookForSale => bookForSale.Seller)
                .WithMany(seller => seller.SellerBooks)
                .HasForeignKey(bookForSale => bookForSale.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many Relationship between Order and OrderDetail
            builder.Entity<OrderDetail>()
                .HasOne(orderDetail => orderDetail.Order)
                .WithMany(order => order.OrderDetails)
                .HasForeignKey(orderDetail => orderDetail.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-Many Relationship between Buyer and Order
            builder.Entity<Order>()
                .HasOne(order => order.Buyer)
                .WithMany(buyer => buyer.Orders)
                .HasForeignKey(order => order.BuyerId);

            // One-to-Many Relationship between Buyer and Address
            builder.Entity<Address>()
                .HasOne(address => address.AddressHolder)
                .WithMany(appUser => appUser.AddressList)
                .HasForeignKey(address => address.AppUserId);

            // One-to-Many Relationship between Buyer and ShoppingCart
            builder.Entity<ShoppingCart>()
                .HasOne(shoppingCart => shoppingCart.Buyer)
                .WithMany(buyer => buyer.ShoppingCartItems)
                .HasForeignKey(shoppingCart => shoppingCart.BuyerId);

            // One-to-Many Relationship between BookForSale and ShoppingCart
            builder.Entity<ShoppingCart>()
                .HasOne(shoppingCart => shoppingCart.BookForSale)
                .WithMany(bookForSale => bookForSale.ShoppingCartItems)
                .HasForeignKey(shoppingCart => shoppingCart.BookForSaleId);

            // One-to-One Relationship between Order and Delivery
            builder.Entity<Order>()
                .HasOne(order => order.Delivery)
                .WithOne(delivery => delivery.Order)
                .HasForeignKey<Delivery>(delivery => delivery.OrderId);

            // One-to-One Relationship between Order and Payment
            builder.Entity<Order>()
                .HasOne(order => order.Payment)
                .WithOne(payment => payment.Order)
                .HasForeignKey<Payment>(payment => payment.OrderId);

            // Ignore IdentityUser table not to create it in our db.
            builder.Ignore<IdentityUser>();

            /* AppUser is created by fluent api without any DbSet.
             * Discriminator for AppUser(Buyer or Seller) Configuration */
            builder.Entity<AppUser>()
                .ToTable("AppUser")
                .HasDiscriminator<UserType>("UserType")
                .HasValue<Buyer>(UserType.Buyer)
                .HasValue<Seller>(UserType.Seller);
        }

        public DbSet<Book> Book { get; set; }
        public DbSet<BookDetail> BookDetail { get; set; }
        public DbSet<BookAuthor> BookAuthor { get; set; }
        public DbSet<Author> Author { get; set; }
        public DbSet<Buyer> Buyer { get; set; }
        public DbSet<Seller> Seller { get; set; }
        public DbSet<BookForSale> BookForSale { get; set; }
        public DbSet<Address> Address { get; set; }
        public DbSet<ShoppingCart> ShoppingCart { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderDetail> OrderDetail { get; set; }
        public DbSet<Delivery> Delivery { get; set; }
        public DbSet<Payment> Payment { get; set; }
    }
}