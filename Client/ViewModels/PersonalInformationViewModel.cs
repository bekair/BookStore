using Client.ViewModels.Base;
using Common.Enums;

namespace Client.ViewModels
{
    public class PersonalInformationViewModel : ViewModelBase
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long IdentityNumber { get; set; }
        public UserType UserType { get; set; }
    }
}
