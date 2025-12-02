using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class ProductAttributeValueConfiguration : IEntityTypeConfiguration<ProductAttributeValue>
    {
        public void Configure(EntityTypeBuilder<ProductAttributeValue> builder)
        {
            builder.ToTable("ProductAttributeValues");

            builder.HasKey(pav => pav.Id);

            builder.Property(pav => pav.DisplayOrder)
                .IsRequired()
                .HasDefaultValue(0);

            // Properties
            builder.Property(pav => pav.Value)
                .IsRequired()
                .HasMaxLength(200);

            // Indexes
            builder.HasIndex(pav => new { pav.ProductVariantId, pav.ProductAttributeId })
                .IsUnique();
        }
    }
}
