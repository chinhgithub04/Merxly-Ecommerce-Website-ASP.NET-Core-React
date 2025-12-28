using merxly.Domain.Entities;
using merxly.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");

            builder.HasKey(p => p.Id);

            // Properties
            builder.Property(p => p.PaymentIntentId)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.Amount)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(p => p.Currency)
                .IsRequired()
                .HasDefaultValue("vnd")
                .HasMaxLength(3);

            builder.Property(p => p.TotalCommission)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(p => p.Status)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(p => p.StripeCustomerId)
                .HasMaxLength(100);

            builder.Property(p => p.PaymentMethodId)
                .HasMaxLength(100);

            builder.Property(p => p.ReceiptUrl)
                .HasMaxLength(500);

            builder.Property(p => p.FailureMessage)
                .HasMaxLength(1000);

            builder.Property(p => p.CreatedAt)
                .IsRequired();

            // Relationships
            builder.HasMany(p => p.Refunds)
                .WithOne(r => r.Payment)
                .HasForeignKey(r => r.PaymentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(p => p.StoreTransfers)
                .WithOne(st => st.Payment)
                .HasForeignKey(st => st.PaymentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(p => p.PaymentIntentId)
                .IsUnique();

            builder.HasIndex(p => p.OrderId)
                .IsUnique();

            builder.HasIndex(p => p.StripeCustomerId);
            builder.HasIndex(p => p.CreatedAt);
        }
    }
}
