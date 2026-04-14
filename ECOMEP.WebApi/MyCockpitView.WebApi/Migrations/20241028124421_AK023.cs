using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK023 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AssisstantID",
                table: "ContactTeams",
                newName: "AssistantID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_AssistantID",
                table: "ContactTeams",
                column: "AssistantID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeams_LeaderID",
                table: "ContactTeams",
                column: "LeaderID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ContactTeams_AssistantID",
                table: "ContactTeams");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeams_LeaderID",
                table: "ContactTeams");

            migrationBuilder.RenameColumn(
                name: "AssistantID",
                table: "ContactTeams",
                newName: "AssisstantID");
        }
    }
}
