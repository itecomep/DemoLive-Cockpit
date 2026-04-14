using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK044 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "WFTasks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "WFTaskAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "WFStages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "WFStageActions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "TypeMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Todos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "TodoAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "TodoAgendas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "TimeEntries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "StatusMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "RequestTicketAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "RequestTicketAssignees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectWorkOrderSegments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectWorkOrderSegmentMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectWorkOrders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectWorkOrderMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectWorkOrderAttachements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectWorkOrderAreas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectTeams",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectStages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectStageMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectStageMasterDeliveries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectStageDeliveries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectNotes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectInwards",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectInwardAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectBills",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectBillPayments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectBillPaymentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectAssociations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectAreaStages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectAreaStageDeliveries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ProjectAreas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "PackageStudioWorks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "PackageStudioWorkAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Packages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "PackageContacts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "PackageAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "MeetingAttendees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "MeetingAgendaAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "LoginSessions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ImageLibraryEntities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ContactTeams",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ContactTeamMembers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Contacts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ContactAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ContactAssociations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ContactAppointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "ContactAppointmentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Companies",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Assessments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "AssessmentMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "AppSettingMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReadOnly",
                table: "Activities",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "WFTasks");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "WFTaskAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "WFStages");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "WFStageActions");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "TypeMasters");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "TodoAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "TodoAgendas");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "TimeEntries");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "StatusMasters");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "RequestTicketAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "RequestTicketAssignees");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectWorkOrderSegments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectWorkOrderSegmentMasters");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectWorkOrders");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectWorkOrderMasters");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectWorkOrderAttachements");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectWorkOrderAreas");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectTeams");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectStageMasters");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectStageMasterDeliveries");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectStageDeliveries");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectNotes");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectInwards");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectInwardAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectBillPayments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectBillPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectAssociations");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectAreaStages");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectAreaStageDeliveries");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ProjectAreas");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "PackageStudioWorks");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "PackageStudioWorkAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "PackageContacts");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "PackageAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "MeetingAttendees");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "MeetingAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "LoginSessions");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ImageLibraryEntities");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ContactTeams");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ContactTeamMembers");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ContactAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ContactAssociations");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ContactAppointments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "AssessmentMasters");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "AppSettingMasters");

            migrationBuilder.DropColumn(
                name: "IsReadOnly",
                table: "Activities");
        }
    }
}
