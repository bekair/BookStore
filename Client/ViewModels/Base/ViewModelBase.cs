using System;
using System.Collections.Generic;
using System.Text;

namespace Client.ViewModels.Base
{
    public class ViewModelBase
    {
        public IEnumerable<ErrorInformationViewModel> ErrorList { get; set; }

        public bool IsSucceeded { get; set; }


        public ViewModelBase()
        {
            ErrorList = new List<ErrorInformationViewModel>();
        }
    }
}
