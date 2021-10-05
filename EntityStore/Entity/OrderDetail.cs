using EntityStore.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("OrderDetail")]
    public class OrderDetail : EntityBase
    {
        [ForeignKey("Order")]
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [ForeignKey("ShoppingCart")]
        [Required]
        public int ShoppingCartId { get; set; }
        public ShoppingCart ShoppingCart { get; set; }

        [Required]
        public double SubTotalPrice { get; set; }
    }
}
