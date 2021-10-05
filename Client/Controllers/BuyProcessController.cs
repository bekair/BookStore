using System;
using System.Collections.Generic;
using Client.Controllers.Base;
using Client.Extensions;
using Client.ViewModels;
using Client.ViewModels.Base;
using Common.Enums;
using DataAccess.BaseAPI;
using EntityStore.Base;
using EntityStore.Entity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Linq;
using DataAccess.Result;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    public class BuyProcessController : BaseController
    {

        public BuyProcessController(IUnitOfWork unitOfWork)
                : base(unitOfWork)
        { }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("[action]")]
        public JsonResult AddToCart([FromBody] AddToCartViewModel addToCartViewModel)
        {
            int bookForSaleId = addToCartViewModel.BookForSaleId;
            string sellerId = addToCartViewModel.SellerId;
            string loggedInUserId = User.GetLoggedInUserID();

            try
            {
                _unitOfWork.ShoppingCartRepository.AddToShoppingCart(sellerId, loggedInUserId, bookForSaleId);
                _unitOfWork.Commit();

                addToCartViewModel.IsSucceeded = true;
            }
            catch (Exception ex)
            {
                addToCartViewModel.ErrorList.Append(
                    new ErrorInformationViewModel(ex, ex.Message)
                );
                addToCartViewModel.IsSucceeded = false;
            }

            return Json(addToCartViewModel);
        }

        [HttpGet("[action]")]
        public JsonResult GetShoppingCartItems()
        {
            string loggedInUserId = User.GetLoggedInUserID();
            IEnumerable<ShoppingCart> cartItems = _unitOfWork.ShoppingCartRepository.GetBuyerCartItems(loggedInUserId);

            return Json(cartItems);
        }

    }

}
