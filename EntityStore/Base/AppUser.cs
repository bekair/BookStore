using Common.Enums;
using EntityStore.Entity;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Base
{
    public abstract class AppUser : IdentityUser, IEntity
    {
        public AppUser() : base()
        {
            this.AddressList = new HashSet<Address>();
        }

        public AppUser(string userName) : base(userName)
        {
            this.AddressList = new HashSet<Address>();
        }

        public long IdentityNumber { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public UserType UserType { get; set; }

        public virtual IEnumerable<Address> AddressList { get; set; }
    }
}
