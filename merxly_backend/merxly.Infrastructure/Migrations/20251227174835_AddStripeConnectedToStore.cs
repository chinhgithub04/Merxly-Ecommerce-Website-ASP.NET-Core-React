using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace merxly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStripeConnectedToStore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPayoutEnabled",
                table: "Stores",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "StripeAccountStatus",
                table: "Stores",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductVariantId",
                table: "CartItems",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPayoutEnabled",
                table: "Stores");

            migrationBuilder.DropColumn(
                name: "StripeAccountStatus",
                table: "Stores");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductVariantId",
                table: "CartItems",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");
        }
    }
}
