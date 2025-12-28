using FluentValidation;
using FluentValidation.AspNetCore;
using merxly.Application.Interfaces.Services;
using merxly.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace merxly.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            // FluentValidation
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddFluentValidationAutoValidation();

            // Service Registrations
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IStoreService, StoreService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IUserPaymentMethodService, UserPaymentMethodService>();
            services.AddScoped<ICustomerAddressService, CustomerAddressService>();

            // AutoMapper Configuration
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            return services;
        }
    }
}
