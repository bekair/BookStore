using DataAccess.DbContext;
using DataAccess.BaseAPI;
using DataAccess.BaseEntityInterfaces;
using EntityStore.Entity;
using Microsoft.AspNetCore.Identity;
using EntityStore.Base;

namespace DataAccess.DataAccessImplementations
{
    public class BuyerRepository : AppUserRepository, IBuyerRepository
    {
        public BuyerRepository(BookStoreDbContext dbContext, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager) : base(dbContext, userManager, signInManager)
        {
        }
    }
}

