using System.Security.Claims;
using System.Threading.Tasks;
using Client.Extensions;
using DataAccess.BaseAPI;
using EntityStore.Base;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Client.Controllers.Base
{
    public class BaseController : Controller
    {
        protected readonly IUnitOfWork _unitOfWork;

        public BaseController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public BaseController()
        {
            
        }
    }
}
