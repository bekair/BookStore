using Common.Enums;
using EntityStore.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("Order")]
    public class Order : EntityBase
    {
        public Order() : base()
        {
            this.OrderDetails = new HashSet<OrderDetail>();
        }

        [ForeignKey("Buyer")]
        [Required]
        public string BuyerId { get; set; }
        public Buyer Buyer { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public string Description { get; set; }

        [Required]
        public OrderState OrderState { get; set; } = OrderState.Pending;

        //OneToMany Navigation Property
        public virtual IEnumerable<OrderDetail> OrderDetails { get; set; }

        //OneToOne Navigation Property
        public Delivery Delivery { get; set; }

        //OneToOne Navigation Property
        public Payment Payment { get; set; }
    }
}
