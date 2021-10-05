using Client.ViewModels.Base;

namespace Client.ViewModels
{
    public class AddToCartViewModel : ViewModelBase
    {
        public int BookForSaleId { get; set; }
        public string SellerId { get; set; }
    }
}
