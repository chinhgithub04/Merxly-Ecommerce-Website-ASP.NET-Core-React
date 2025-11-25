using merxly.Application.Settings;
using merxly.Domain.Constants;
using merxly.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace merxly.Infrastructure.Data
{
    public class DbInitializer
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            if (!await roleManager.RoleExistsAsync(UserRoles.Admin))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

            if (!await roleManager.RoleExistsAsync(UserRoles.Customer))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.Customer));

            if (!await roleManager.RoleExistsAsync(UserRoles.StoreOwner))
                await roleManager.CreateAsync(new IdentityRole(UserRoles.StoreOwner));
        }

        public static async Task SeedAdminAsync(UserManager<ApplicationUser> userManager, AdminSettings adminSettings)
        {
            var adminUser = await userManager.FindByEmailAsync(adminSettings.Email);
            
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminSettings.Email,
                    Email = adminSettings.Email,
                    FirstName = adminSettings.FirstName,
                    LastName = adminSettings.LastName,
                    PhoneNumber = adminSettings.PhoneNumber,
                    IsActive = true,
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(adminUser, adminSettings.Password);
                
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
                }
            }
        }
    }
}
