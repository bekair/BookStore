using Common.Enums;
using EntityStore.Base;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EntityStore.Entity
{
    [Table("Address")]
    public class Address : EntityBase
    {
        //Buyer or Seller class entity
        [ForeignKey("AddressHolder")]
        [Required]
        public string AppUserId { get; set; }
        public AppUser AddressHolder { get; set; }

        [Required]
        public string AddressName { get; set; }

        [Required]
        public AddressType AddressType { get; set; }

        public string AddressContent { get; set; }

        [Required]
        public string City { get; set; }

        public string PostalCode { get; set; }
    }
}
