using System;
using Client.ViewModels.Base;
using Common.Enums;
using Microsoft.AspNetCore.Http;

namespace Client.ViewModels
{
    public class BookAddViewModel : ViewModelBase
    {
        public string BookTitle { get; set; }
        public string AuthorName { get; set; }
        public BookCategory? BookCategory { get; set; }
        public IFormFile CoverPhoto { get; set; }
        public int PageCount { get; set; }
        public DateTime? PublishDate { get; set; }
        public string PublisherName { get; set; }
    }
}