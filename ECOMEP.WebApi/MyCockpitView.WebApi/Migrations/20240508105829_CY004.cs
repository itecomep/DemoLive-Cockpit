using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class CY004 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ManagerContactID",
                table: "ContactAppointments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_ManagerContactID",
                table: "ContactAppointments",
                column: "ManagerContactID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Contacts_ManagerContactID",
                table: "ContactAppointments",
                column: "ManagerContactID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Contacts_ManagerContactID",
                table: "ContactAppointments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointments_ManagerContactID",
                table: "ContactAppointments");

            migrationBuilder.DropColumn(
                name: "ManagerContactID",
                table: "ContactAppointments");
        }
    }
}
