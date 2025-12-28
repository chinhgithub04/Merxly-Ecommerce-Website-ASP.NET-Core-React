using merxly.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace merxly.Infrastructure.Persistence.Configurations
{
    public class AddressConfiguration : IEntityTypeConfiguration<Address>
    {
        public void Configure(EntityTypeBuilder<Address> builder)
        {
            builder.ToTable("Addresses");

            builder.HasKey(a => a.Id);

            // Properties
            builder.Property(a => a.FullName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.Title)
                .HasMaxLength(100);

            builder.Property(a => a.AddressLine)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(a => a.CityCode)
                .IsRequired();

            builder.Property(a => a.CityName)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(a => a.WardCode)
                .IsRequired();

            builder.Property(a => a.WardName)
                .IsRequired()
                .HasMaxLength(300);

            builder.Property(a => a.PostalCode)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(a => a.PhoneNumber)
                .HasMaxLength(11);

            builder.Property(a => a.IsDefault)
                .IsRequired()
                .HasDefaultValue(false);

            builder.Property(a => a.CreatedAt)
                .IsRequired();

            // Indexes
            builder.HasIndex(a => new { a.UserId, a.IsDefault });
        }
    }
}
