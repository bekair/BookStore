using Common.Enums;
using EntityStore.Base;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("BookForSale")]
    public class BookForSale : EntityBase
    {
        public BookForSale() : base() { }

        [ForeignKey("Seller")]
        [Required]
        public string SellerId { get; set; }
        public Seller Seller { get; set; }

        [ForeignKey("Book")]
        [Required]
        public int BookId { get; set; }
        public Book Book { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public double Price { get; set; }

        [Required]
        public CurrencyType CurrencyType { get; set; } = CurrencyType.TRY;

        [Required]
        [Column("SaleStatus")]
        public SaleState SaleStatus { get; set; } = SaleState.WaitingForSale;

        [Required]
        public int Quantity { get; set; } = 1;
        public IEnumerable<ShoppingCart> ShoppingCartItems { get; set; }
    }
}
