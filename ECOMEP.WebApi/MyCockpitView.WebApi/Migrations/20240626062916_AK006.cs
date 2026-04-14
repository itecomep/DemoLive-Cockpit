using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK006 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Contacts_CompanyContactID",
                table: "ContactAppointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_CompanyContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CompanyContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointments_CompanyContactID",
                table: "ContactAppointments");

            migrationBuilder.DropColumn(
                name: "CompanyContactID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "CompanyContactID",
                table: "ContactAppointments");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactID",
                table: "Companies",
                type: "int",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects",
                column: "ClientContactID",
                principalTable: "Contacts",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects",
                column: "ReferredByContactID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ContactID",
                table: "Companies");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "Projects",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CompanyContactID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyContactID",
                table: "ContactAppointments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CompanyContactID",
                table: "Projects",
                column: "CompanyContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_CompanyContactID",
                table: "ContactAppointments",
                column: "CompanyContactID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Contacts_CompanyContactID",
                table: "ContactAppointments",
                column: "CompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects",
                column: "ClientContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_CompanyContactID",
                table: "Projects",
                column: "CompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects",
                column: "ReferredByContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
