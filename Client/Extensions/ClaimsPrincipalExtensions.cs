using System;
using System.Security.Claims;

namespace Client.Extensions
{
    public static class ClaimsPrincipalExtensions
    {

        public static string GetLoggedInUserID(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            return principal.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        public static string GetLoggedInUserName(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            return principal.FindFirstValue(ClaimTypes.Name);
        }

        public static string GetLoggedInUserEmail(this ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }
                
            return principal.FindFirstValue(ClaimTypes.Email);
        }
    }
}
