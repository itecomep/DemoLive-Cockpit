using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM064 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroupCompanyContactID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_GroupCompanyContactID",
                table: "Projects",
                column: "GroupCompanyContactID");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_GroupCompanyContactID",
                table: "Projects",
                column: "GroupCompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_GroupCompanyContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_GroupCompanyContactID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GroupCompanyContactID",
                table: "Projects");
        }
    }
}
