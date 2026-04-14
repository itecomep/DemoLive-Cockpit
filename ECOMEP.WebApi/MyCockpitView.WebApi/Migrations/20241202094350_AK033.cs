using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK033 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "ProjectInwards",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProjectTeams",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    ContactTeamID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectTeams", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectTeams_ContactTeams_ContactTeamID",
                        column: x => x.ContactTeamID,
                        principalTable: "ContactTeams",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectTeams_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_Title",
                table: "ProjectInwards",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_ContactTeamID",
                table: "ProjectTeams",
                column: "ContactTeamID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_Created",
                table: "ProjectTeams",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_CreatedByContactID",
                table: "ProjectTeams",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_IsDeleted",
                table: "ProjectTeams",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_Modified",
                table: "ProjectTeams",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_ModifiedByContactID",
                table: "ProjectTeams",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_OrderFlag",
                table: "ProjectTeams",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_ProjectID",
                table: "ProjectTeams",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_StatusFlag",
                table: "ProjectTeams",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_TypeFlag",
                table: "ProjectTeams",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectTeams_UID",
                table: "ProjectTeams",
                column: "UID");

            migrationBuilder.Sql(" Insert Into ProjectTeams(UID,Created,Modified,TypeFlag,StatusFlag,OrderFlag,isdeleted, ProjectID,ContactTeamID)\r\n select newid(),GETUTCDATE(),GETUTCDATE(),0,0,0,0,P.ID,T.ID from Projects P join ContactTeams T on T.ID=P.TeamID where P.TeamID is not null");

            migrationBuilder.DropColumn(
              name: "TeamID",
              table: "Projects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectTeams");

            migrationBuilder.DropIndex(
                name: "IX_ProjectInwards_Title",
                table: "ProjectInwards");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "ProjectInwards");

            migrationBuilder.AddColumn<int>(
                name: "TeamID",
                table: "Projects",
                type: "int",
                nullable: true);
        }
    }
}
