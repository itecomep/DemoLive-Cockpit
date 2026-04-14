using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK043 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "WFTaskAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "TodoAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "RequestTicketAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "ProjectWorkOrderAttachements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "ProjectInwardAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "ProjectBillPaymentAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "ProjectAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "PackageStudioWorkAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "PackageAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "MeetingAgendaAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "ImageLibraryEntities",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "ContactAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FolderPath",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "WFTaskAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "TodoAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "RequestTicketAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "ProjectWorkOrderAttachements");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "ProjectInwardAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "ProjectBillPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "PackageStudioWorkAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "PackageAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "MeetingAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "ImageLibraryEntities");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "ContactAttachments");

            migrationBuilder.DropColumn(
                name: "FolderPath",
                table: "ContactAppointmentAttachments");
        }
    }
}
