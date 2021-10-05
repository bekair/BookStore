using System.Collections.Generic;
using Client.ViewModels.Base;
using Common.Enums;

namespace Client.ViewModels
{
    public class AccountInformationViewModel : ViewModelBase
    {
        //Personal Information
        public string UserName { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long IdentityNumber { get; set; }
        public UserType UserType { get; set; }

        //Contact Information
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        //Address
        public string AddressName { get; set; }
        public AddressType AddressType { get; set; }
        public string City { get; set; }
        public string AddressContent { get; set; }
        public string PostalCode { get; set; }
    }
}