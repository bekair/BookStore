using System;
using System.Reflection;
using BookStore.Business.ApiCallers;
using DataAccess.BaseAPI;
using DataAccess.DbContext;
using DataAccess.UnitOfWork;
using EntityStore.Base;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace BookStore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc()
                    .AddJsonOptions(options => 
                        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    );
            services.AddSingleton<IGoogleBookApiCaller>(new GoogleBookApiCaller(Configuration));

            string connectionString = Configuration.GetConnectionString("Default");
            string currentAssemblyName = Assembly.GetExecutingAssembly().GetName().Name;

            services.AddDbContext<BookStoreDbContext>(option =>
            {
                option.UseSqlServer
                (
                    connectionString,
                    obj => obj.MigrationsAssembly(currentAssemblyName)
                );
            });

            services.AddIdentity<AppUser, IdentityRole>(option =>
            {
                option.Password = new PasswordOptions
                {
                    RequireDigit = true,
                    RequiredLength = 7,
                    RequiredUniqueChars = 1,
                    RequireLowercase = true,
                    RequireUppercase = true
                };

                option.User = new UserOptions
                {
                    //AllowedUserNameCharacters='ABCD' "REGEX is accepted????"
                    RequireUniqueEmail = true
                };

                option.SignIn = new SignInOptions
                {
                    RequireConfirmedEmail = false,//Todo: How to use
                    RequireConfirmedPhoneNumber = false//Todo: How to use
                };

                option.Lockout = new LockoutOptions
                {
                    AllowedForNewUsers = false,
                    DefaultLockoutTimeSpan = new TimeSpan(0, 15, 0),
                    MaxFailedAccessAttempts = 3
                };
            }).AddEntityFrameworkStores<BookStoreDbContext>()
              .AddDefaultTokenProviders();

            services.AddTransient<IUnitOfWork, UnitOfWork>();

            //By default login will look at AccountController
            services.ConfigureApplicationCookie(option =>
            {
                option.LoginPath = "/Login/Index";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
