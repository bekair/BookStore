using EntityStore.Base;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    public class Seller : AppUser
    {
        public Seller() : base()
        {
            this.SoldOrder = new HashSet<Order>();
            this.SellerBooks = new HashSet<BookForSale>();
        }

        public Seller(string userName) : base(userName)
        {
            this.SoldOrder = new HashSet<Order>();
            this.SellerBooks = new HashSet<BookForSale>();
        }

        public virtual IEnumerable<Order> SoldOrder { get; set; }

        public virtual IEnumerable<BookForSale> SellerBooks { get; set; }
    }
}

