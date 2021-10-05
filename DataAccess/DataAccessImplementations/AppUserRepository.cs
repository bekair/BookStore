using Common.Enums;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using DataAccess.DbContext;
using EntityStore.Base;
using EntityStore.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.DataAccessImplementations
{
    public class AppUserRepository : BaseRepository<AppUser>, IAppUserRepository
    {
        public UserManager<AppUser> UserManager { get; set; }
        public SignInManager<AppUser> SignInManager { get; set; }

        public AppUserRepository(BookStoreDbContext dbContext, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager) : base(dbContext)
        {
            this.UserManager = userManager;
            this.SignInManager = signInManager;
        }

        public async Task<IdentityResult> CreateUser(AppUser newUser, string password)
        {
            IdentityResult result = await UserManager.CreateAsync(newUser, password);
            return result;
        }

        public async Task<SignInResult> SignInUser(string userName, string password, bool rememberMe, bool lockoutOnFailure)
        {
            SignInResult result = await SignInManager.PasswordSignInAsync(userName, password, rememberMe, lockoutOnFailure);
            return result;
        }

        public async Task SignOutUser()
        {
            await SignInManager.SignOutAsync();
        }

        public Address GetUserAddressByType(string userId, AddressType addressType)
        {
            return dbContext.Address.Where(address => address.AppUserId == userId && address.AddressType == addressType)
                                    .FirstOrDefault();
        }

        public AppUser GetAppUserAllInformationByUserId(string userId)
        {
            return dbEntity.Include(user => user.AddressList)
                           .Where(user => user.Id == userId)
                           .FirstOrDefault();
        }

        public AppUser GetPersonalInformationByUserId(string userId, UserType userType)
        {
            if (userType == UserType.Buyer)
            {
                return dbEntity.Where(user => user.Id == userId)
                               .Select(user => new Buyer
                               {
                                   UserName = user.UserName,
                                   FirstName = user.FirstName,
                                   LastName = user.LastName,
                                   IdentityNumber = user.IdentityNumber,
                                   UserType = user.UserType
                               })
                               .FirstOrDefault();
            }
            else
            {
                return dbEntity.Where(user => user.Id == userId)
                               .Select(user => new Seller
                               {
                                   UserName = user.UserName,
                                   FirstName = user.FirstName,
                                   LastName = user.LastName,
                                   IdentityNumber = user.IdentityNumber,
                                   UserType = user.UserType
                               })
                               .FirstOrDefault();
            }
        }

        public AppUser GetContactInformationByUserId(string userId, UserType userType)
        {
            if (userType == UserType.Buyer)
            {
                return dbEntity.Where(user => user.Id == userId)
                               .Select(user => new Buyer
                               {
                                   Email = user.Email,
                                   PhoneNumber = user.PhoneNumber
                               })
                               .FirstOrDefault();
            }
            else
            {
                return dbEntity.Where(user => user.Id == userId)
                               .Select(user => new Seller
                               {
                                   Email = user.Email,
                                   PhoneNumber = user.PhoneNumber
                               })
                               .FirstOrDefault();
            }
        }

        public UserType GetUserTypeByUserId(string userId)
        {
            return dbEntity.Where(user => user.Id == userId)
                           .Select(user => user.UserType)
                           .FirstOrDefault();
        }
    }
}