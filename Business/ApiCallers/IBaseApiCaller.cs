using System;
using System.Collections.Specialized;
using BookStore.Common.Enums;

namespace BookStore.Business.ApiCallers
{
    public interface IBaseApiCaller
    {
        Uri BuildUri(NameValueCollection queryCollection);
    }
}