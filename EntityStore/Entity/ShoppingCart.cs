using EntityStore.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("ShoppingCart")]
    public class ShoppingCart : EntityBase
    {
        public ShoppingCart() : base() { }

        [ForeignKey("Buyer")]
        [Required]
        public string BuyerId { get; set; }
        public Buyer Buyer { get; set; }

        [ForeignKey("BookForSale")]
        [Required]
        public int BookForSaleId { get; set; }
        public BookForSale BookForSale { get; set; }

        [Required]
        public int Quantity { get; set; }

    }
}
