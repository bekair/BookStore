using EntityStore.Base;
using System.Collections.Generic;

namespace EntityStore.Entity
{
    public class Buyer : AppUser
    {
        public Buyer() : base()
        {
            this.Orders = new HashSet<Order>();
        }

        public Buyer(string userName) : base(userName)
        {
            this.Orders = new HashSet<Order>();
        }

        public virtual IEnumerable<Order> Orders { get; set; }
        public virtual IEnumerable<ShoppingCart> ShoppingCartItems { get; set; }
    }
}
