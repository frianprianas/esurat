using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplikasiSurat.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CanManagePerihal",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanManageSuratKeluar",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "CanManageSuratMasuk",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CanManagePerihal", "CanManageSuratKeluar", "CanManageSuratMasuk", "Role" },
                values: new object[] { true, true, true, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CanManagePerihal",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CanManageSuratKeluar",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CanManageSuratMasuk",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");
        }
    }
}
