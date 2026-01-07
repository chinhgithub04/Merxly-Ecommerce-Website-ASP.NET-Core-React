using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.ToTable("Reviews");

            builder.HasKey(r => r.Id);

            // Properties
            builder.Property(r => r.Rating)
                .IsRequired();

            builder.Property(r => r.Comment)
                .HasMaxLength(2000);

            builder.Property(r => r.SellerReply)
                .HasMaxLength(2000);

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            // Relationships
            builder.HasOne(r => r.OrderItem)
                .WithOne()
                .HasForeignKey<Review>(r => r.OrderItemId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(r => r.Medias)
                .WithOne(ri => ri.Review)
                .HasForeignKey(ri => ri.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(r => r.ProductVariant)
                .WithMany()
                .HasForeignKey(r => r.ProductVariantId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Store)
                .WithMany()
                .HasForeignKey(r => r.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(r => new { r.ProductId, r.CreatedAt });
            builder.HasIndex(r => r.StoreId);
            builder.HasIndex(r => r.UserId);
            builder.HasIndex(r => r.OrderItemId)
                .IsUnique()
                .HasDatabaseName("IX_Reviews_OrderItemId");
        }
    }
}
