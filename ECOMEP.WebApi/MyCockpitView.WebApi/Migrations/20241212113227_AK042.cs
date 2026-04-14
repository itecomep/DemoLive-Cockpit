using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK042 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "WFTaskAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "WFTaskAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "TodoAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "TodoAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "RequestTicketAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "RequestTicketAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "ProjectWorkOrderAttachements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "ProjectWorkOrderAttachements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "ProjectInwardAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "ProjectInwardAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "ProjectBillPaymentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "ProjectBillPaymentAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "ProjectAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "ProjectAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "PackageStudioWorkAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "PackageStudioWorkAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "PackageAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "PackageAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "MeetingAgendaAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "MeetingAgendaAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "ImageLibraryEntities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "ImageLibraryEntities",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "ContactAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "ContactAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFolder",
                table: "ContactAppointmentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "WFTaskAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "WFTaskAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "TodoAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "TodoAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "RequestTicketAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "RequestTicketAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "ProjectWorkOrderAttachements");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "ProjectWorkOrderAttachements");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "ProjectInwardAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "ProjectInwardAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "ProjectBillPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "ProjectBillPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "PackageStudioWorkAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "PackageStudioWorkAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "PackageAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "PackageAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "MeetingAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "MeetingAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "ImageLibraryEntities");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "ImageLibraryEntities");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "ContactAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "ContactAttachments");

            migrationBuilder.DropColumn(
                name: "IsFolder",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "ContactAppointmentAttachments");
        }
    }
}
