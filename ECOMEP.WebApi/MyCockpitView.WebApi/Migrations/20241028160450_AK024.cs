using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK024 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactTeams_Contacts_ContactID",
                table: "ContactTeams");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeams_ContactID",
                table: "ContactTeams");

            migrationBuilder.DropColumn(
                name: "ContactID",
                table: "ContactTeams");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContactID",
                table: "ContactTeams",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_ContactID",
                table: "ContactTeams",
                column: "ContactID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactTeams_Contacts_ContactID",
                table: "ContactTeams",
                column: "ContactID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }
    }
}
