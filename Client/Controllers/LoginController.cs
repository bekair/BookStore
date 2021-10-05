using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Client.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Client.Controllers.Base;
using Client.ViewModels.Base;
using Newtonsoft.Json;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;
using Microsoft.AspNetCore.Authorization;
using Common.Enums;
using EntityStore.Entity;
using EntityStore.Base;
using DataAccess.BaseAPI;
using Client.Extensions;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Client.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : BaseController
    {

        public LoginController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("[action]")]
        public async Task<string> CreateUserAsync([FromBody] SignUpViewModel signUpViewModel)
        {
            AppUser newUser = null;
            if (signUpViewModel.UserType == UserType.Buyer)
            {
                newUser = new Buyer
                {
                    FirstName = signUpViewModel.FirstName,
                    LastName = signUpViewModel.LastName,
                    UserName = signUpViewModel.UserName,
                    Email = signUpViewModel.Email,
                    PhoneNumber = signUpViewModel.PhoneNumber.ToString()
                };
            }
            else if (signUpViewModel.UserType == UserType.Seller)
            {
                newUser = new Seller
                {
                    UserName = signUpViewModel.UserName,
                    Email = signUpViewModel.Email,
                    PhoneNumber = signUpViewModel.PhoneNumber.ToString()
                };
            }
            else
            {
                Exception exception = new Exception("There is no user type except Buyer and Seller.");
                ErrorInformationViewModel errorInformationViewModel = new ErrorInformationViewModel(exception, exception.Message);

                return JsonConvert.SerializeObject(errorInformationViewModel);
            }


            IdentityResult result = await _unitOfWork.AppUserRepository.CreateUser(newUser, signUpViewModel.Password);
            if (!result.Succeeded)
            {
                result.Errors.ToList()
                             .ForEach(error =>
                             {
                                 Exception exception = new Exception($"{error.Description}");

                                 ((List<ErrorInformationViewModel>)signUpViewModel.ErrorList).Add
                                 (
                                     new ErrorInformationViewModel(exception, exception.Message)
                                 );
                             });

                return JsonConvert.SerializeObject(signUpViewModel.ErrorList.ToList());
            }

            signUpViewModel.IsSucceeded = true;
            return JsonConvert.SerializeObject(signUpViewModel);
        }

        [HttpPost("[action]")]
        public async Task<string> Login([FromBody] LoginViewModel loginViewModel)
        {
            SignInResult result = await _unitOfWork.AppUserRepository.SignInUser(loginViewModel.UserName, loginViewModel.Password, loginViewModel.RememberMe, false);
            if (!result.Succeeded)
            {
                Exception exception = new Exception($"Username and/or Password is incorrect.");

                loginViewModel.IsSucceeded = false;
                loginViewModel.ErrorList = loginViewModel.ErrorList.Append
                (
                    new ErrorInformationViewModel(exception, exception.Message)
                );

                return JsonConvert.SerializeObject(loginViewModel.ErrorList.ToList()[0]);
            }

            loginViewModel.IsSucceeded = true;
            return JsonConvert.SerializeObject(loginViewModel);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<bool> LogoutAsync()
        {
            await _unitOfWork.AppUserRepository.SignOutUser();

            return true;
        }

        [HttpGet("[action]")]
        public bool IsLoggedIn()
        {
            string currentUserId = User.GetLoggedInUserID();

            return currentUserId == null ? false : true;
        }

        [HttpGet("[action]")]
        public JsonResult GetUserTypeOfLoggedInUser()
        {
            string loggedInUserId = User.GetLoggedInUserID();
            UserType userType = _unitOfWork.AppUserRepository.GetUserTypeByUserId(loggedInUserId);

            return Json(userType);
        }

    }


}
