using Client.ViewModels.Base;
using Common.Enums;

namespace Client.ViewModels
{
    public class AddressInformationViewModel : ViewModelBase
    {
        public string AddressName { get; set; }
        public AddressType AddressType { get; set; }
        public string City { get; set; }
        public string AddressContent { get; set; }
        public string PostalCode { get; set; }
    }
}
