using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");

            builder.HasKey(p => p.Id);

            // Properties
            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(p => p.Description)
                .HasMaxLength(5000);

            builder.Property(p => p.IsStoreFeatured)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(p => p.IsPlatformFeatured)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(p => p.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(p => p.MinPrice)
                .HasPrecision(18, 2);

            builder.Property(p => p.MaxPrice)
                .HasPrecision(18, 2);

            builder.Property(p => p.TotalStock)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(p => p.MainMediaPublicId)
                .HasMaxLength(500);

            builder.Property(p => p.AverageRating)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(p => p.ReviewCount)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(p => p.TotalSold)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(p => p.CreatedAt)
                .IsRequired();

            // Relationships
            builder.HasMany(p => p.Variants)
                .WithOne(v => v.Product)
                .HasForeignKey(v => v.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.Reviews)
                .WithOne(r => r.Product)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(p => p.Name);
            builder.HasIndex(p => p.CreatedAt);
            builder.HasIndex(p => p.StoreId);

            builder.HasIndex(p => new { p.IsActive, p.MinPrice });
            builder.HasIndex(p => new { p.CategoryId, p.IsActive, p.MinPrice });
            builder.HasIndex(p => new { p.IsActive, p.AverageRating, p.ReviewCount });
            builder.HasIndex(p => new { p.IsActive, p.TotalSold });
        }
    }
}
