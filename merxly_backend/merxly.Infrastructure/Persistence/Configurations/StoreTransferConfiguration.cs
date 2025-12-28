using merxly.Domain.Entities;
using merxly.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class StoreTransferConfiguration : IEntityTypeConfiguration<StoreTransfer>
    {
        public void Configure(EntityTypeBuilder<StoreTransfer> builder)
        {
            builder.ToTable("StoreTransfers");

            builder.HasKey(st => st.Id);

            // Properties
            builder.Property(st => st.StripeTransferId)
                .HasMaxLength(100);

            builder.Property(st => st.Amount)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(st => st.Commission)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(st => st.Status)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(st => st.FailureMessage)
                .HasMaxLength(1000);

            builder.Property(st => st.CreatedAt)
                .IsRequired();

            builder.Property(st => st.UpdatedAt);

            builder.Property(st => st.TransferredAt);

            // Relationships
            builder.HasOne(st => st.Store)
                .WithMany(s => s.StoreTransfers)
                .HasForeignKey(st => st.StoreId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(st => st.StripeTransferId)
                .IsUnique();

            builder.HasIndex(st => new { st.PaymentId, st.StoreId })
                .IsUnique();

            builder.HasIndex(st => st.Status);
            builder.HasIndex(st => st.CreatedAt);
        }
    }
}
