using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace merxly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DenormalizeProductEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvatarUrl",
                table: "Users",
                newName: "AvatarPublicId");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "ReviewMedia",
                newName: "MediaPublicId");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "ProductVariantMedia",
                newName: "MediaPublicId");

            migrationBuilder.RenameColumn(
                name: "ShortDescription",
                table: "Products",
                newName: "MainMediaPublicId");

            migrationBuilder.RenameColumn(
                name: "IsFeatured",
                table: "Products",
                newName: "IsStoreFeatured");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Products",
                type: "varchar(5000)",
                maxLength: 5000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(5000)",
                oldMaxLength: 5000)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "Products",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "IsPlatformFeatured",
                table: "Products",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxPrice",
                table: "Products",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MinPrice",
                table: "Products",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReviewCount",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalStock",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId_IsActive_MinPrice",
                table: "Products",
                columns: new[] { "CategoryId", "IsActive", "MinPrice" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_AverageRating_ReviewCount",
                table: "Products",
                columns: new[] { "IsActive", "AverageRating", "ReviewCount" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_MinPrice",
                table: "Products",
                columns: new[] { "IsActive", "MinPrice" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_CategoryId_IsActive_MinPrice",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_AverageRating_ReviewCount",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_MinPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsPlatformFeatured",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MaxPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ReviewCount",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "TotalStock",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "AvatarPublicId",
                table: "Users",
                newName: "AvatarUrl");

            migrationBuilder.RenameColumn(
                name: "MediaPublicId",
                table: "ReviewMedia",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "MediaPublicId",
                table: "ProductVariantMedia",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "MainMediaPublicId",
                table: "Products",
                newName: "ShortDescription");

            migrationBuilder.RenameColumn(
                name: "IsStoreFeatured",
                table: "Products",
                newName: "IsFeatured");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Description",
                keyValue: null,
                column: "Description",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Products",
                type: "varchar(5000)",
                maxLength: 5000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(5000)",
                oldMaxLength: 5000,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
