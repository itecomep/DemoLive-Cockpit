using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM054 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactWorkOrders_Contacts_CompanyID",
                table: "ContactWorkOrders");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactWorkOrders_Companies_CompanyID",
                table: "ContactWorkOrders",
                column: "CompanyID",
                principalTable: "Companies",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactWorkOrders_Companies_CompanyID",
                table: "ContactWorkOrders");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactWorkOrders_Contacts_CompanyID",
                table: "ContactWorkOrders",
                column: "CompanyID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }
    }
}
