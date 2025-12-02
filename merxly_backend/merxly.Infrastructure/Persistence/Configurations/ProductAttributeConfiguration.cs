using merxly.Domain.Entities;
using merxly.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class ProductAttributeConfiguration : IEntityTypeConfiguration<ProductAttribute>
    {
        public void Configure(EntityTypeBuilder<ProductAttribute> builder)
        {
            builder.ToTable("ProductAttributes");

            builder.HasKey(a => a.Id);

            // Properties
            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.DisplayOrder)
                .IsRequired()
                .HasDefaultValue(0);

            // Relationships
            builder.HasMany(a => a.ProductAttributeValues)
                .WithOne(pav => pav.ProductAttribute)
                .HasForeignKey(pav => pav.ProductAttributeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(a => a.Name)
                .IsUnique();
        }
    }
}
