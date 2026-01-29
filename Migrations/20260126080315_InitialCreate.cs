using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplikasiSurat.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SuratKeluar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomorSurat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TanggalKeluar = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Penerima = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Perihal = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuratKeluar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SuratMasuk",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomorSurat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TanggalMasuk = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Pengirim = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Perihal = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuratMasuk", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SuratKeluar");

            migrationBuilder.DropTable(
                name: "SuratMasuk");
        }
    }
}
