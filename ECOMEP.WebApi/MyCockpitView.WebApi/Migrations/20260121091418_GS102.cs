using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class GS102 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GmailTokens_ProjectId",
                table: "GmailTokens");

            migrationBuilder.CreateIndex(
                name: "IX_GmailTokens_ProjectId",
                table: "GmailTokens",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GmailTokens_ProjectId",
                table: "GmailTokens");

            migrationBuilder.CreateIndex(
                name: "IX_GmailTokens_ProjectId",
                table: "GmailTokens",
                column: "ProjectId",
                unique: true);
        }
    }
}
