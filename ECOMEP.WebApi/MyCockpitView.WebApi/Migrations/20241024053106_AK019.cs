using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK019 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "_phones",
                table: "Contacts",
                newName: "PhonesJson");

            migrationBuilder.RenameColumn(
                name: "_emails",
                table: "Contacts",
                newName: "EmailsJson");

            migrationBuilder.RenameColumn(
                name: "_addresses",
                table: "Contacts",
                newName: "AddressesJson");

            migrationBuilder.CreateTable(
                name: "ContactTeams",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    MembersJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_ContactTeams", x => x.ID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_Created",
                table: "ContactTeams",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_CreatedByContactID",
                table: "ContactTeams",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_IsDeleted",
                table: "ContactTeams",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_Modified",
                table: "ContactTeams",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_ModifiedByContactID",
                table: "ContactTeams",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_OrderFlag",
                table: "ContactTeams",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_StatusFlag",
                table: "ContactTeams",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_Title",
                table: "ContactTeams",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_TypeFlag",
                table: "ContactTeams",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_UID",
                table: "ContactTeams",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactTeams");

            migrationBuilder.RenameColumn(
                name: "PhonesJson",
                table: "Contacts",
                newName: "_phones");

            migrationBuilder.RenameColumn(
                name: "EmailsJson",
                table: "Contacts",
                newName: "_emails");

            migrationBuilder.RenameColumn(
                name: "AddressesJson",
                table: "Contacts",
                newName: "_addresses");
        }
    }
}
