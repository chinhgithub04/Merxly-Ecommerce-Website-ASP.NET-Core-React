using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace merxly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFileNameToMediaVariant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileExtension",
                table: "ProductVariantMedia",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "ProductVariantMedia",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<long>(
                name: "FileSizeInBytes",
                table: "ProductVariantMedia",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileExtension",
                table: "ProductVariantMedia");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "ProductVariantMedia");

            migrationBuilder.DropColumn(
                name: "FileSizeInBytes",
                table: "ProductVariantMedia");
        }
    }
}
