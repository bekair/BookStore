using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Client.ViewModels.Base;
using Common.Enums;

namespace Client.ViewModels
{
    public class SignUpViewModel : ViewModelBase
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public int PhoneNumber { get; set; }
        public UserType UserType { get; set; }
    }
}
