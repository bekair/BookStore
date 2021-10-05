using Common.Enums;
using EntityStore.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("DeliveryInformation")]
    public class Delivery : EntityBase
    {
        [ForeignKey("Order")]
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        public DateTime? DeliveryDate { get; set; }

        [DataType(DataType.Currency)]
        [Required]
        public double Price { get; set; } = 8.99;

        [Required]
        public CurrencyType Currency { get; set; } = CurrencyType.TRY;

    }
}
