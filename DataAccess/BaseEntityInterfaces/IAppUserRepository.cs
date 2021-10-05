using Common.Enums;
using DataAccess.BaseAPI;
using EntityStore.Base;
using EntityStore.Entity;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace DataAccess.BaseEntityInterfaces
{
    public interface IAppUserRepository : IRepository<AppUser>
    {
        UserManager<AppUser> UserManager { get; set; }
        SignInManager<AppUser> SignInManager { get; set; }
        Task<IdentityResult> CreateUser(AppUser newUser, string password);
        Task<SignInResult> SignInUser(string userName, string password, bool rememberMe, bool lockoutOnFailure);
        Task SignOutUser();
        Address GetUserAddressByType(string userId ,AddressType addressType);
        AppUser GetAppUserAllInformationByUserId(string userId);
        AppUser GetPersonalInformationByUserId(string userId, UserType userType);
        AppUser GetContactInformationByUserId(string userId, UserType userType);
        UserType GetUserTypeByUserId(string userId);
    }
}