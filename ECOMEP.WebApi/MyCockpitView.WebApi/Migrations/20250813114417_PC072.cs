using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class PC072 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SiteVisits",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ClosedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinalizedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Version = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    Annexure = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteVisits", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SiteVisits_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteVisitAgendas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    SiteVisitID = table.Column<int>(type: "int", nullable: false),
                    SiteVisitDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SiteVisitTitle = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Subtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActionBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ActionByContactID = table.Column<int>(type: "int", nullable: true),
                    PreviousHistory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousDueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PreviousActionBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousAgendaID = table.Column<int>(type: "int", nullable: true),
                    IsForwarded = table.Column<bool>(type: "bit", nullable: false),
                    ReminderCount = table.Column<int>(type: "int", nullable: false),
                    UpdateFrom = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    IsInspection = table.Column<bool>(type: "bit", nullable: false),
                    NotDiscussed = table.Column<bool>(type: "bit", nullable: false),
                    SendUpdate = table.Column<bool>(type: "bit", nullable: false),
                    Progress = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PreviousProgress = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TodoID = table.Column<int>(type: "int", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteVisitAgendas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SiteVisitAgendas_SiteVisits_SiteVisitID",
                        column: x => x.SiteVisitID,
                        principalTable: "SiteVisits",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteVisitAttendees",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SiteVisitID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Company = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: true),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteVisitAttendees", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SiteVisitAttendees_SiteVisits_SiteVisitID",
                        column: x => x.SiteVisitID,
                        principalTable: "SiteVisits",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SiteVisitAgendaAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SiteVisitAgendaID = table.Column<int>(type: "int", nullable: false),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    IsFolder = table.Column<bool>(type: "bit", nullable: false),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    FolderPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteVisitAgendaAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SiteVisitAgendaAttachments_SiteVisitAgendas_SiteVisitAgendaID",
                        column: x => x.SiteVisitAgendaID,
                        principalTable: "SiteVisitAgendas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_Created",
                table: "SiteVisitAgendaAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_CreatedByContactID",
                table: "SiteVisitAgendaAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_Filename",
                table: "SiteVisitAgendaAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_IsDeleted",
                table: "SiteVisitAgendaAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_Modified",
                table: "SiteVisitAgendaAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_ModifiedByContactID",
                table: "SiteVisitAgendaAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_OrderFlag",
                table: "SiteVisitAgendaAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_SiteVisitAgendaID",
                table: "SiteVisitAgendaAttachments",
                column: "SiteVisitAgendaID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_StatusFlag",
                table: "SiteVisitAgendaAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_TypeFlag",
                table: "SiteVisitAgendaAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendaAttachments_UID",
                table: "SiteVisitAgendaAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_ActionBy",
                table: "SiteVisitAgendas",
                column: "ActionBy");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_ActionByContactID",
                table: "SiteVisitAgendas",
                column: "ActionByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_Created",
                table: "SiteVisitAgendas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_CreatedByContactID",
                table: "SiteVisitAgendas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_DueDate",
                table: "SiteVisitAgendas",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_IsDeleted",
                table: "SiteVisitAgendas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_IsForwarded",
                table: "SiteVisitAgendas",
                column: "IsForwarded");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_IsInspection",
                table: "SiteVisitAgendas",
                column: "IsInspection");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_IsReadOnly",
                table: "SiteVisitAgendas",
                column: "IsReadOnly");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_Modified",
                table: "SiteVisitAgendas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_ModifiedByContactID",
                table: "SiteVisitAgendas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_NotDiscussed",
                table: "SiteVisitAgendas",
                column: "NotDiscussed");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_OrderFlag",
                table: "SiteVisitAgendas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_PreviousAgendaID",
                table: "SiteVisitAgendas",
                column: "PreviousAgendaID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_ProjectID",
                table: "SiteVisitAgendas",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_ReminderCount",
                table: "SiteVisitAgendas",
                column: "ReminderCount");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_SendUpdate",
                table: "SiteVisitAgendas",
                column: "SendUpdate");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_SiteVisitDate",
                table: "SiteVisitAgendas",
                column: "SiteVisitDate");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_SiteVisitID",
                table: "SiteVisitAgendas",
                column: "SiteVisitID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_SiteVisitTitle",
                table: "SiteVisitAgendas",
                column: "SiteVisitTitle");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_StatusFlag",
                table: "SiteVisitAgendas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_Subtitle",
                table: "SiteVisitAgendas",
                column: "Subtitle");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_Title",
                table: "SiteVisitAgendas",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_TodoID",
                table: "SiteVisitAgendas",
                column: "TodoID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_TypeFlag",
                table: "SiteVisitAgendas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAgendas_UID",
                table: "SiteVisitAgendas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_Company",
                table: "SiteVisitAttendees",
                column: "Company");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_ContactID",
                table: "SiteVisitAttendees",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_Created",
                table: "SiteVisitAttendees",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_CreatedByContactID",
                table: "SiteVisitAttendees",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_Email",
                table: "SiteVisitAttendees",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_IsDeleted",
                table: "SiteVisitAttendees",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_Modified",
                table: "SiteVisitAttendees",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_ModifiedByContactID",
                table: "SiteVisitAttendees",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_Name",
                table: "SiteVisitAttendees",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_OrderFlag",
                table: "SiteVisitAttendees",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_SiteVisitID",
                table: "SiteVisitAttendees",
                column: "SiteVisitID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_StatusFlag",
                table: "SiteVisitAttendees",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_TypeFlag",
                table: "SiteVisitAttendees",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisitAttendees_UID",
                table: "SiteVisitAttendees",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_Code",
                table: "SiteVisits",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_ContactID",
                table: "SiteVisits",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_Created",
                table: "SiteVisits",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_CreatedByContactID",
                table: "SiteVisits",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_EndDate",
                table: "SiteVisits",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_IsDeleted",
                table: "SiteVisits",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_IsReadOnly",
                table: "SiteVisits",
                column: "IsReadOnly");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_Modified",
                table: "SiteVisits",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_ModifiedByContactID",
                table: "SiteVisits",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_OrderFlag",
                table: "SiteVisits",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_ProjectID",
                table: "SiteVisits",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_StartDate",
                table: "SiteVisits",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_StatusFlag",
                table: "SiteVisits",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_Title",
                table: "SiteVisits",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_TypeFlag",
                table: "SiteVisits",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SiteVisits_UID",
                table: "SiteVisits",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SiteVisitAgendaAttachments");

            migrationBuilder.DropTable(
                name: "SiteVisitAttendees");

            migrationBuilder.DropTable(
                name: "SiteVisitAgendas");

            migrationBuilder.DropTable(
                name: "SiteVisits");
        }
    }
}
