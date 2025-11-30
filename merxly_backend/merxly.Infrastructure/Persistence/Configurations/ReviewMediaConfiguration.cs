using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class ReviewMediaConfiguration : IEntityTypeConfiguration<ReviewMedia>
    {
        public void Configure(EntityTypeBuilder<ReviewMedia> builder)
        {
            builder.ToTable("ReviewMedia");

            builder.HasKey(ri => ri.Id);

            // Properties
            builder.Property(ri => ri.MediaPublicId)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(ri => ri.DisplayOrder)
                .IsRequired()
                .HasDefaultValue(0);

            builder.Property(ri => ri.CreatedAt)
                .IsRequired();

            builder.Property(ri => ri.MediaType)
                .IsRequired()
                .HasConversion<int>();

            // Indexes
            builder.HasIndex(ri => new { ri.ReviewId, ri.DisplayOrder });
        }
    }
}
