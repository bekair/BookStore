using System;
using System.Collections.Generic;
using System.Text;

namespace Client.ViewModels.Base
{
    public class ErrorInformationViewModel
    {
        public Exception ExceptionType { get; set; }
        public string ExceptionMessage { get; set; }

        public ErrorInformationViewModel(Exception ExceptionType, string ExceptionMessage)
        {
            this.ExceptionType = ExceptionType;
            this.ExceptionMessage = ExceptionMessage;
        }
    }
}
