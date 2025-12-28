using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace merxly.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class updateAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "StoreAddresses");

            migrationBuilder.DropColumn(
                name: "City",
                table: "StoreAddresses");

            migrationBuilder.DropColumn(
                name: "StateProvince",
                table: "StoreAddresses");

            migrationBuilder.DropColumn(
                name: "AddressLine2",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "StateProvince",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "AddressLine1",
                table: "StoreAddresses",
                newName: "AddressLine");

            migrationBuilder.RenameColumn(
                name: "AddressLine1",
                table: "Addresses",
                newName: "AddressLine");

            migrationBuilder.AddColumn<int>(
                name: "CityCode",
                table: "StoreAddresses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CityName",
                table: "StoreAddresses",
                type: "varchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "WardCode",
                table: "StoreAddresses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WardName",
                table: "StoreAddresses",
                type: "varchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "CityCode",
                table: "Addresses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CityName",
                table: "Addresses",
                type: "varchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Addresses",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "WardCode",
                table: "Addresses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WardName",
                table: "Addresses",
                type: "varchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CityCode",
                table: "StoreAddresses");

            migrationBuilder.DropColumn(
                name: "CityName",
                table: "StoreAddresses");

            migrationBuilder.DropColumn(
                name: "WardCode",
                table: "StoreAddresses");

            migrationBuilder.DropColumn(
                name: "WardName",
                table: "StoreAddresses");

            migrationBuilder.DropColumn(
                name: "CityCode",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "CityName",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "WardCode",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "WardName",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "AddressLine",
                table: "StoreAddresses",
                newName: "AddressLine1");

            migrationBuilder.RenameColumn(
                name: "AddressLine",
                table: "Addresses",
                newName: "AddressLine1");

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "StoreAddresses",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "StoreAddresses",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "StateProvince",
                table: "StoreAddresses",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AddressLine2",
                table: "Addresses",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Addresses",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "StateProvince",
                table: "Addresses",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
