﻿using DataAccess.BaseAPI;
using EntityStore.Entity;
using System.Collections.Generic;

namespace DataAccess.BaseEntityInterfaces
{
    public interface IAddressRepository : IRepository<Address>
    {
        IEnumerable<Address> GetAddressInformationByUserId(string userId);
    }
}
