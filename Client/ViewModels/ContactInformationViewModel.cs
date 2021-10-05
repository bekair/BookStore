﻿using Client.ViewModels.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Client.ViewModels
{
    public class ContactInformationViewModel : ViewModelBase
    {
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }
}
