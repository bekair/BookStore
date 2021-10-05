using Common.Enums;
using EntityStore.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("Payment")]
    public class Payment : EntityBase
    {
        [ForeignKey("Order")]
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        [Required]
        public PaymentState PaymentState { get; set; } = PaymentState.Pending;

        [Required]
        public double TotalPaymentPrice { get; set; }
    }
}
