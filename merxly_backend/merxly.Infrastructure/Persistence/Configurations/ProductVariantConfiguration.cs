using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
    {
        public void Configure(EntityTypeBuilder<ProductVariant> builder)
        {
            builder.ToTable("ProductVariants");

            builder.HasKey(pv => pv.Id);

            // Properties
            builder.Property(pv => pv.SKU)
                .HasMaxLength(100);

            builder.Property(pv => pv.Price)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(pv => pv.Weight)
                .HasPrecision(10, 2);

            builder.Property(pv => pv.Length)
                .HasPrecision(10, 2);

            builder.Property(pv => pv.Width)
                .HasPrecision(10, 2);

            builder.Property(pv => pv.Height)
                .HasPrecision(10, 2);

            builder.Property(pv => pv.StockQuantity)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(pv => pv.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(pv => pv.CreatedAt)
                .IsRequired();

            builder.Property(pv => pv.UpdatedAt);

            // Relationships
            builder.HasMany(pv => pv.AttributeValues)
                .WithOne(av => av.ProductVariant)
                .HasForeignKey(av => av.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(pv => pv.Media)
                .WithOne(m => m.ProductVariant)
                .HasForeignKey(m => m.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes
            builder.HasIndex(pv => pv.SKU)
                .IsUnique()
                .HasFilter("`SKU` IS NOT NULL");
        }
    }
}
