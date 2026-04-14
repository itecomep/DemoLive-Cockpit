using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK073 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "WFTasks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "WFTasks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "WFTaskAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "WFTaskAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "WFTaskAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "WFStages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "WFStages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "WFStageActions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "WFStageActions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "TypeMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "TypeMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Todos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Todos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "TodoAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "TodoAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "TodoAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "TodoAgendas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "TodoAgendas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "TimeEntries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "TimeEntries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "StatusMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "StatusMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "SiteVisits",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "SiteVisits",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "SiteVisitAttendees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "SiteVisitAttendees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "SiteVisitAgendas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "SiteVisitAgendas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "SiteVisitAgendaAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "SiteVisitAgendaAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "SiteVisitAgendaAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "RequestTickets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "RequestTickets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "RequestTicketAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "RequestTicketAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "RequestTicketAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "RequestTicketAssignees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "RequestTicketAssignees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectWorkOrderServiceAmounts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectWorkOrderServiceAmounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectWorkOrderSegments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectWorkOrderSegments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectWorkOrderSegmentMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectWorkOrderSegmentMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectWorkOrders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectWorkOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectWorkOrderMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectWorkOrderMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ProjectWorkOrderAttachements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectWorkOrderAttachements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectWorkOrderAttachements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectWorkOrderAreas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectWorkOrderAreas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectTeams",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectTeams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectStages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectStages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectStageMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectStageMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectStageMasterDeliveries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectStageMasterDeliveries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectStageDeliveries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectStageDeliveries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Projects",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectNotes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectNotes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectInwards",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectInwards",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ProjectInwardAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectInwardAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectInwardAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectBills",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectBills",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectBillPayments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectBillPayments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ProjectBillPaymentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectBillPaymentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectBillPaymentAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ProjectAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectAssociations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectAssociations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectAreaStages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectAreaStages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectAreaStageDeliveries",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectAreaStageDeliveries",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ProjectAreas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ProjectAreas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "PackageStudioWorks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "PackageStudioWorks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "PackageStudioWorkAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "PackageStudioWorkAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "PackageStudioWorkAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Packages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Packages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "PackageContacts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "PackageContacts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "PackageAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "PackageAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "PackageAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Meetings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Meetings",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "MeetingAttendees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "MeetingAttendees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "MeetingAgendas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "MeetingAgendas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "MeetingAgendaAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "MeetingAgendaAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "MeetingAgendaAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "LoginSessions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "LoginSessions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Leaves",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Leaves",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ImageLibraryEntities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ImageLibraryEntities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ImageLibraryEntities",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "HolidayMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "HolidayMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactWorkOrders",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactWorkOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactWorkOrderPayments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactWorkOrderPayments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ContactWorkOrderPaymentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactWorkOrderPaymentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactWorkOrderPaymentAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ContactWorkOrderAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactWorkOrderAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactWorkOrderAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactTeams",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactTeams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactTeamMembers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactTeamMembers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Contacts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Contacts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ContactAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactAssociations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactAssociations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactAppointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
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

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ContactAppointmentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ContactAppointmentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Companies",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Companies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Assessments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Assessments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "AssessmentMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "AssessmentMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "AppSettingMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "AppSettingMasters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessed",
                table: "ActivityAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "ActivityAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "ActivityAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVersion",
                table: "Activities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentVersionID",
                table: "Activities",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "WFTasks");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "WFTasks");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "WFTaskAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "WFTaskAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "WFTaskAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "WFStages");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "WFStages");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "WFStageActions");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "WFStageActions");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "TypeMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "TypeMasters");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "TodoAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "TodoAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "TodoAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "TodoAgendas");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "TodoAgendas");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "TimeEntries");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "TimeEntries");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "StatusMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "StatusMasters");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "SiteVisits");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "SiteVisits");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "SiteVisitAttendees");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "SiteVisitAttendees");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "SiteVisitAgendas");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "SiteVisitAgendas");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "SiteVisitAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "SiteVisitAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "SiteVisitAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "RequestTickets");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "RequestTickets");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "RequestTicketAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "RequestTicketAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "RequestTicketAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "RequestTicketAssignees");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "RequestTicketAssignees");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectWorkOrderServiceAmounts");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectWorkOrderServiceAmounts");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectWorkOrderSegments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectWorkOrderSegments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectWorkOrderSegmentMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectWorkOrderSegmentMasters");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectWorkOrders");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectWorkOrders");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectWorkOrderMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectWorkOrderMasters");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ProjectWorkOrderAttachements");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectWorkOrderAttachements");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectWorkOrderAttachements");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectWorkOrderAreas");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectWorkOrderAreas");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectTeams");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectTeams");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectStageMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectStageMasters");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectStageMasterDeliveries");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectStageMasterDeliveries");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectStageDeliveries");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectStageDeliveries");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectNotes");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectNotes");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectInwards");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectInwards");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ProjectInwardAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectInwardAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectInwardAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectBillPayments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectBillPayments");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ProjectBillPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectBillPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectBillPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectAssociations");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectAssociations");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectAreaStages");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectAreaStages");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectAreaStageDeliveries");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectAreaStageDeliveries");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ProjectAreas");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ProjectAreas");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "PackageStudioWorks");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "PackageStudioWorks");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "PackageStudioWorkAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "PackageStudioWorkAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "PackageStudioWorkAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "PackageContacts");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "PackageContacts");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "PackageAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "PackageAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "PackageAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "MeetingAttendees");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "MeetingAttendees");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "MeetingAgendas");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "MeetingAgendas");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "MeetingAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "MeetingAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "MeetingAgendaAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "LoginSessions");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "LoginSessions");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Leaves");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Leaves");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ImageLibraryEntities");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ImageLibraryEntities");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ImageLibraryEntities");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "HolidayMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "HolidayMasters");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactWorkOrders");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactWorkOrders");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactWorkOrderPayments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactWorkOrderPayments");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ContactWorkOrderPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactWorkOrderPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactWorkOrderPaymentAttachments");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ContactWorkOrderAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactWorkOrderAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactWorkOrderAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactTeams");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactTeams");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactTeamMembers");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactTeamMembers");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ContactAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactAssociations");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactAssociations");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactAppointments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactAppointments");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Assessments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "AssessmentMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "AssessmentMasters");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "AppSettingMasters");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "AppSettingMasters");

            migrationBuilder.DropColumn(
                name: "IsProcessed",
                table: "ActivityAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "ActivityAttachments");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "ActivityAttachments");

            migrationBuilder.DropColumn(
                name: "IsVersion",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ParentVersionID",
                table: "Activities");

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
        }
    }
}
