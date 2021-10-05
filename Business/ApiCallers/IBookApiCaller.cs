using System;
using BookStore.Common.Enums;

namespace BookStore.Business.ApiCallers
{
    public interface IBookApiCaller
    {
        string GetBook(BookSearchCriteria criteria, string searchKey);
    }
}