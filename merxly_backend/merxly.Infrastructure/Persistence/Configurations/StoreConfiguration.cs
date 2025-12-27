using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class StoreConfiguration : IEntityTypeConfiguration<Store>
    {
        public void Configure(EntityTypeBuilder<Store> builder)
        {
            builder.ToTable("Stores");

            builder.HasKey(s => s.Id);

            // Properties
            builder.Property(s => s.StoreName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(s => s.Description)
                .HasMaxLength(2000);

            builder.Property(s => s.LogoImagePublicId)
                .HasMaxLength(500);

            builder.Property(s => s.BannerImagePublicId)
                .HasMaxLength(500);

            builder.Property(s => s.Email)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(s => s.PhoneNumber)
                .IsRequired()
                .HasMaxLength(11);

            builder.Property(s => s.Website)
                .HasMaxLength(500);

            builder.Property(s => s.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(s => s.IsVerified)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(s => s.CommissionRate)
                .IsRequired()
                .HasPrecision(5, 4)
                .HasDefaultValue(0.10m);

            builder.Property(s => s.CreatedAt)
                .IsRequired();

            builder.Property(s => s.StripeConnectAccountId)
                .HasMaxLength(100);

            builder.Property(s => s.IsPayoutEnabled)
                .IsRequired()
                .HasDefaultValue(false);


            // Relationships
            builder.HasOne(s => s.Address)
                .WithOne(a => a.Store)
                .HasForeignKey<StoreAddress>(a => a.StoreId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(s => s.Products)
                .WithOne(p => p.Store)
                .HasForeignKey(p => p.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(s => s.OrderItems)
                .WithOne(oi => oi.Store)
                .HasForeignKey(oi => oi.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(s => s.StoreName)
                .IsUnique();
            builder.HasIndex(s => s.IsVerified);
            builder.HasIndex(s => s.StripeConnectAccountId);

        }
    }
}
