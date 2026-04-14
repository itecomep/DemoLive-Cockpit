using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK021 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MembersJson",
                table: "ContactTeams");

            migrationBuilder.AddColumn<int>(
                name: "ContactID",
                table: "ContactTeams",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ContactTeamMember",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactTeamID = table.Column<int>(type: "int", nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    IsLeader = table.Column<bool>(type: "bit", nullable: false),
                    IsAssistantLeader = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false),
                    _searchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactTeamMember", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactTeamMember_ContactTeams_ContactTeamID",
                        column: x => x.ContactTeamID,
                        principalTable: "ContactTeams",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContactTeamMember_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_ContactID",
                table: "ContactTeams",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMember_ContactID",
                table: "ContactTeamMember",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMember_ContactTeamID",
                table: "ContactTeamMember",
                column: "ContactTeamID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactTeams_Contacts_ContactID",
                table: "ContactTeams",
                column: "ContactID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactTeams_Contacts_ContactID",
                table: "ContactTeams");

            migrationBuilder.DropTable(
                name: "ContactTeamMember");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeams_ContactID",
                table: "ContactTeams");

            migrationBuilder.DropColumn(
                name: "ContactID",
                table: "ContactTeams");

            migrationBuilder.AddColumn<string>(
                name: "MembersJson",
                table: "ContactTeams",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
