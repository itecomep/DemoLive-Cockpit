using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankAccountNo",
                table: "ContactAppointments");

            migrationBuilder.AddColumn<string>(
                name: "BankAccountNo",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankAccountNo",
                table: "Contacts");

            migrationBuilder.AddColumn<string>(
                name: "BankAccountNo",
                table: "ContactAppointments",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
