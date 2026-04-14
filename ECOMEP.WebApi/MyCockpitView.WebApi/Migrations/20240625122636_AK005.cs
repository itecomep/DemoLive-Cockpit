using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK005 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Contacts_ContactID",
                table: "ContactAppointments");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Contacts_ManagerContactID",
                table: "ContactAppointments");

            migrationBuilder.DropColumn(
                name: "FacadeArea",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "InteriorArea",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "LandscapeArea",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Adhaar",
                table: "Contacts",
                newName: "UDHYAM");

            migrationBuilder.AddColumn<int>(
                name: "CompanyContactID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PhotoUrl",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AADHAR",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Initials",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOwned",
                table: "Contacts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "VHrRate",
                table: "Contacts",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "CompanyContactID",
                table: "ContactAppointments",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Filename",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CompanyContactID",
                table: "Projects",
                column: "CompanyContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_CompanyContactID",
                table: "ContactAppointments",
                column: "CompanyContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_Filename",
                table: "ContactAppointmentAttachments",
                column: "Filename");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Contacts_CompanyContactID",
                table: "ContactAppointments",
                column: "CompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Contacts_ContactID",
                table: "ContactAppointments",
                column: "ContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Contacts_ManagerContactID",
                table: "ContactAppointments",
                column: "ManagerContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_CompanyContactID",
                table: "Projects",
                column: "CompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Contacts_CompanyContactID",
                table: "ContactAppointments");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Contacts_ContactID",
                table: "ContactAppointments");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Contacts_ManagerContactID",
                table: "ContactAppointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_CompanyContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_CompanyContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointments_CompanyContactID",
                table: "ContactAppointments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_Filename",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "CompanyContactID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "AADHAR",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Initials",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "IsOwned",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "VHrRate",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "CompanyContactID",
                table: "ContactAppointments");

            migrationBuilder.RenameColumn(
                name: "UDHYAM",
                table: "Contacts",
                newName: "Adhaar");

            migrationBuilder.AddColumn<decimal>(
                name: "FacadeArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "InteriorArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LandscapeArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "PhotoUrl",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Filename",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Contacts_ContactID",
                table: "ContactAppointments",
                column: "ContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Contacts_ManagerContactID",
                table: "ContactAppointments",
                column: "ManagerContactID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }
    }
}
