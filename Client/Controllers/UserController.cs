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

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    public class UserController : BaseController
    {

        public UserController(IUnitOfWork unitOfWork)
                : base(unitOfWork)
        { }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("[action]")]
        public JsonResult GetAllAccountInformation()
        {
            string loggedInUserId = User.GetLoggedInUserID();
            AppUser loggedInUserGeneralInformation = _unitOfWork.AppUserRepository.GetAppUserAllInformationByUserId(loggedInUserId);
            //TODO: Both address' should be taken from db.
            Address userHomeAddress = loggedInUserGeneralInformation.AddressList
                                                                    .Where(address => address.AddressType == AddressType.Home)
                                                                    .FirstOrDefault();
            AccountInformationViewModel accountInformationViewModel = new AccountInformationViewModel
            {
                FirstName = loggedInUserGeneralInformation.FirstName,
                LastName = loggedInUserGeneralInformation.LastName,
                UserName = loggedInUserGeneralInformation.UserName,
                IdentityNumber = loggedInUserGeneralInformation.IdentityNumber,
                UserType = loggedInUserGeneralInformation.UserType,
                PhoneNumber = loggedInUserGeneralInformation.PhoneNumber,
                Email = loggedInUserGeneralInformation.Email,
                AddressName = userHomeAddress.AddressName,
                AddressContent = userHomeAddress.AddressContent,
                AddressType = userHomeAddress.AddressType,
                City = userHomeAddress.City,
                PostalCode = userHomeAddress.PostalCode,
                IsSucceeded = true
            };

            return Json(accountInformationViewModel);
        }

        [HttpGet("[action]")]
        public JsonResult GetPersonalInformation()
        {
            string loggedInUserId = User.GetLoggedInUserID();
            UserType userType = _unitOfWork.AppUserRepository.GetUserTypeByUserId(loggedInUserId);
            AppUser loggedInUserPersonalInformation = _unitOfWork.AppUserRepository.GetPersonalInformationByUserId(loggedInUserId, userType);

            PersonalInformationViewModel personalInformationViewModel = new PersonalInformationViewModel();
            if (loggedInUserPersonalInformation != null)
            {
                personalInformationViewModel = new PersonalInformationViewModel
                {
                    FirstName = loggedInUserPersonalInformation.FirstName,
                    LastName = loggedInUserPersonalInformation.LastName,
                    UserName = loggedInUserPersonalInformation.UserName,
                    IdentityNumber = loggedInUserPersonalInformation.IdentityNumber,
                    UserType = loggedInUserPersonalInformation.UserType,
                    IsSucceeded = true
                };
            }

            return Json(personalInformationViewModel);
        }

        [HttpPost("[action]")]
        public string SavePersonalInformation([FromBody] PersonalInformationViewModel personalInformationViewModel)
        {
            string loggedInUserId = User.GetLoggedInUserID();
            AppUser loggedInUser = _unitOfWork.AppUserRepository.GetByID(loggedInUserId);
            loggedInUser.FirstName = personalInformationViewModel.FirstName;
            loggedInUser.LastName = personalInformationViewModel.LastName;
            loggedInUser.IdentityNumber = personalInformationViewModel.IdentityNumber;

            _unitOfWork.AppUserRepository.AddOrUpdate(loggedInUser);
            _unitOfWork.Commit();
            personalInformationViewModel.IsSucceeded = true;

            return JsonConvert.SerializeObject(personalInformationViewModel);
        }

        [HttpGet("[action]")]
        public JsonResult GetContactInformation()
        {
            string loggedInUserId = User.GetLoggedInUserID();
            UserType userType = _unitOfWork.AppUserRepository.GetUserTypeByUserId(loggedInUserId);
            AppUser loggedInUserContactInformation = _unitOfWork.AppUserRepository.GetContactInformationByUserId(loggedInUserId, userType);

            ContactInformationViewModel contactInformationViewModel = new ContactInformationViewModel();
            if (loggedInUserContactInformation != null)
            {
                contactInformationViewModel = new ContactInformationViewModel
                {
                    Email = loggedInUserContactInformation.Email,
                    PhoneNumber = loggedInUserContactInformation.PhoneNumber,
                    IsSucceeded = true
                };
            }

            return Json(contactInformationViewModel);
        }

        [HttpPost("[action]")]
        public string SaveContactInformation([FromBody] ContactInformationViewModel contactInformationViewModel)
        {
            string loggedInUserId = User.GetLoggedInUserID();
            AppUser loggedInUser = _unitOfWork.AppUserRepository.GetByID(loggedInUserId);
            loggedInUser.Email = contactInformationViewModel.Email;
            loggedInUser.PhoneNumber = contactInformationViewModel.PhoneNumber;

            _unitOfWork.AppUserRepository.AddOrUpdate(loggedInUser);
            _unitOfWork.Commit();
            contactInformationViewModel.IsSucceeded = true;

            return JsonConvert.SerializeObject(contactInformationViewModel);
        }

        [HttpGet("[action]")]
        public JsonResult GetAddressInformation()
        {
            string loggedInUserId = User.GetLoggedInUserID();
            Address loggedInUserAddressInformation = _unitOfWork.AddressRepository.GetAddressInformationByUserId(loggedInUserId).FirstOrDefault();
            AddressInformationViewModel addressInformationViewModel = new AddressInformationViewModel
            {
                AddressType = 0
            };

            if (loggedInUserAddressInformation != null)
            {
                addressInformationViewModel = new AddressInformationViewModel
                {
                    AddressContent = loggedInUserAddressInformation.AddressContent,
                    AddressName = loggedInUserAddressInformation.AddressName,
                    AddressType = loggedInUserAddressInformation.AddressType,
                    City = loggedInUserAddressInformation.City,
                    PostalCode = loggedInUserAddressInformation.PostalCode,
                    IsSucceeded = true
                };
            }

            return Json(addressInformationViewModel);
        }

        [HttpPost("[action]")]
        public string SaveAddressInformation([FromBody] AddressInformationViewModel addressInformationViewModel)
        {
            string loggedInUserId = User.GetLoggedInUserID();
            IEnumerable<Address> loggedInUserAddressInformation = _unitOfWork.AddressRepository.GetAddressInformationByUserId(loggedInUserId);

            Address userAddress = null;
            if (loggedInUserAddressInformation.Count() == 0)
            {
                AppUser loggedInUser = _unitOfWork.AppUserRepository.GetByID(loggedInUserId);
                userAddress = new Address
                {
                    AddressContent = addressInformationViewModel.AddressContent,
                    AddressHolder = loggedInUser,
                    AddressName = addressInformationViewModel.AddressName,
                    AddressType = addressInformationViewModel.AddressType,
                    City = addressInformationViewModel.City,
                    PostalCode = addressInformationViewModel.PostalCode
                };
            }
            else
            {
                userAddress = loggedInUserAddressInformation.ElementAt(0);
                userAddress.AddressContent = addressInformationViewModel.AddressContent;
                userAddress.AddressName = addressInformationViewModel.AddressName;
                userAddress.AddressType = addressInformationViewModel.AddressType;
                userAddress.City = addressInformationViewModel.City;
            }

            _unitOfWork.AddressRepository.AddOrUpdate(userAddress);
            _unitOfWork.Commit();
            addressInformationViewModel.IsSucceeded = true;

            return JsonConvert.SerializeObject(addressInformationViewModel);
        }

        [HttpGet("[action]")]
        public JsonResult GetUserTypeOfLoggedInUser()
        {
            string loggedInUserId = User.GetLoggedInUserID();
            UserType userType = _unitOfWork.AppUserRepository.GetUserTypeByUserId(loggedInUserId);

            return Json(userType);
        }

        [HttpPost("[action]")]
        public JsonResult PutBookForSale([FromBody] dynamic bookForSaleModel)
        {
            int bookForSaleId = bookForSaleModel.bookForSaleId;
            double price = bookForSaleModel.price;

            string loggedInUserId = User.GetLoggedInUserID();
            BookForSale updatedBookForSale = _unitOfWork.BookForSaleRepository.GetByID(bookForSaleId);
            updatedBookForSale.Price = price;
            updatedBookForSale.SaleStatus = SaleState.ForSale;
            updatedBookForSale.SellerId = loggedInUserId;

            SellerBookLibraryUpdateViewModel sellerBookLibraryUpdateViewModel;
            try
            {
                _unitOfWork.BookForSaleRepository.Update(updatedBookForSale);
                _unitOfWork.Commit();

                sellerBookLibraryUpdateViewModel = new SellerBookLibraryUpdateViewModel
                {
                    IsSucceeded = true,
                    SaleStatus = updatedBookForSale.SaleStatus
                };
            }
            catch (Exception ex)
            {
                IEnumerable<ErrorInformationViewModel> errorList = new List<ErrorInformationViewModel>();
                ErrorInformationViewModel errorInformationViewModel = new ErrorInformationViewModel(ex, ex.Message);
                errorList.Append(errorInformationViewModel);

                sellerBookLibraryUpdateViewModel = new SellerBookLibraryUpdateViewModel
                {
                    IsSucceeded = false,
                    ErrorList = errorList
                };
            }

            return Json(sellerBookLibraryUpdateViewModel);
        }
    }

}
