using merxly.Domain.Entities;
using merxly.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class ProductVariantMediaConfiguration : IEntityTypeConfiguration<ProductVariantMedia>
    {
        public void Configure(EntityTypeBuilder<ProductVariantMedia> builder)
        {
            builder.ToTable("ProductVariantMedia");

            builder.HasKey(pvm => pvm.Id);

            // Properties
            builder.Property(pvm => pvm.MediaPublicId)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(pvm => pvm.MediaType)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(pvm => pvm.DisplayOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(pvm => pvm.IsMain)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(pvm => pvm.CreatedAt)
                .IsRequired();

            // Indexes
            builder.HasIndex(pvm => new { pvm.ProductVariantId, pvm.DisplayOrder });
            builder.HasIndex(pvm => pvm.ProductVariantId)
                .IsUnique()
                .HasFilter("`IsMain` = 1");
        }
    }
}
