using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using BookStore.Business.ApiCallers;
using BookStore.Common.Enums;
using Client.Controllers.Base;
using Client.Extensions;
using Client.ViewModels;
using Client.ViewModels.Base;
using Common.Enums;
using DataAccess.BaseAPI;
using EntityStore.Base;
using EntityStore.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    public class BookController : BaseController
    {
        private readonly IGoogleBookApiCaller _googleBookAPI;

        public BookController(IGoogleBookApiCaller googleBookApi, IUnitOfWork unitOfWork)
                : base(unitOfWork)
        {
            _googleBookAPI = googleBookApi;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("[action]")]
        public string Fetch([FromQuery]BookSearchCriteria criteria, [FromQuery]string searchKey)
        {
            string books = _googleBookAPI.GetBook(criteria, searchKey); // Get books per criteria
            var regularObject = JsonConvert.DeserializeObject(books); // First, deserialize stream string as .NET object

            return JsonConvert.SerializeObject(regularObject); // Serialize .NET object as JSON object and return it
        }

        [HttpGet("[action]")]
        public string FetchDetail([FromQuery]string id)
        {
            string bookDetail = _googleBookAPI.GetBook(BookSearchCriteria.ISBN, id); // Get books per criteria

            var regularObject = JsonConvert.DeserializeObject(bookDetail); // First, deserialize stream string as .NET object

            return JsonConvert.SerializeObject(regularObject); // Serialize .NET object as JSON object and return it
        }

        [HttpGet("[action]")]
        public string FetchBooksForSearchSuggestion([FromQuery]BookSearchCriteria criteria, [FromQuery]string searchKey)
        {
            string books = _googleBookAPI.GetBook(criteria, searchKey); // Get books per criteria
            JObject regularObject = (JObject)JsonConvert.DeserializeObject(books); // First, deserialize stream string as .NET object                                                                     
            JToken items = regularObject["items"];
            if (items == null)
            {
                return null;
            }

            ICollection<BookSearchViewModel> bookList = new List<BookSearchViewModel>();
            foreach (var item in items)
            {
                bookList.Add(new BookSearchViewModel(item["volumeInfo"]));
            }

            return JsonConvert.SerializeObject(bookList, Formatting.Indented);
        }

        [Authorize]
        [HttpGet("[action]")]
        public JsonResult GetAllBooks()
        {
            string currentUserId = User.GetLoggedInUserID();
            IEnumerable<BookForSale> bookList = _unitOfWork.BookForSaleRepository.GetSellerBooksWithAllInformation(currentUserId);

            return Json(bookList);
        }

        [Authorize]
        [HttpPost("[action]")]
        public string CreateNewBook([FromForm] BookAddViewModel bookAddViewModel)
        {
            if (string.IsNullOrEmpty(bookAddViewModel.AuthorName) || string.IsNullOrEmpty(bookAddViewModel.BookTitle) ||
                string.IsNullOrEmpty(bookAddViewModel.PageCount.ToString()))
            {
                bookAddViewModel.IsSucceeded = false;
                Exception exception = new Exception("Required parameters cannot be empty.");

                ((List<ErrorInformationViewModel>)bookAddViewModel.ErrorList).Add(
                    new ErrorInformationViewModel(exception, exception.Message)
                );

                return JsonConvert.SerializeObject(bookAddViewModel);
            }

            Author author = new Author
            {
                AuthorName = bookAddViewModel.AuthorName
            };

            Book newBook = new Book
            {
                Title = bookAddViewModel.BookTitle
            };

            BookDetail bookDetail = new BookDetail
            {
                Book = newBook,
                BookCategory = bookAddViewModel.BookCategory,
                PageCount = bookAddViewModel.PageCount,
                PublisherName = bookAddViewModel.PublisherName,
                PublishDate = bookAddViewModel.PublishDate
            };
            //Add CoverPhoto as byte[]
            if (!(bookAddViewModel.CoverPhoto is null))
            {
                using (var ms = new MemoryStream())
                {
                    bookAddViewModel.CoverPhoto.CopyTo(ms);
                    bookDetail.CoverPhoto = ms.ToArray();
                }
            }

            BookAuthor bookAuthor = new BookAuthor
            {
                Book = newBook,
                Author = author
            };

            BookForSale bookForSale = new BookForSale
            {
                Book = newBook,
                SellerId = User.GetLoggedInUserID(),
                CurrencyType = CurrencyType.TRY,
                SaleStatus = SaleState.WaitingForSale,
                Price = 0
            };

            _unitOfWork.SellerRepository.AddNewBookToSeller(newBook, bookDetail, bookAuthor, bookForSale);
            try
            {
                _unitOfWork.Commit();
            }
            catch (SqlException exception)
            {
                bookAddViewModel.IsSucceeded = false;
                ((List<ErrorInformationViewModel>)bookAddViewModel.ErrorList).Add
                (
                    new ErrorInformationViewModel(exception, exception.Message)
                );

                return JsonConvert.SerializeObject(bookAddViewModel);
            }

            bookAddViewModel.IsSucceeded = true;
            return JsonConvert.SerializeObject(bookAddViewModel);
        }

        [Authorize]
        [HttpGet("[action]")]
        public JsonResult GetForSaleBooks()
        {
            IEnumerable<BookForSale> allForSaleBooks = _unitOfWork.BookForSaleRepository.GetAllBooksForSale();
            
            return Json(allForSaleBooks);
        }
    }
}