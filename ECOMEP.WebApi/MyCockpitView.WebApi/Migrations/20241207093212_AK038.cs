using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK038 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Total",
                table: "ProjectBillPayments",
                newName: "TDSShare");

            migrationBuilder.RenameColumn(
                name: "TDSRate",
                table: "ProjectBillPayments",
                newName: "TDSAmount");

            migrationBuilder.RenameColumn(
                name: "TDS",
                table: "ProjectBillPayments",
                newName: "NetAmount");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TDSShare",
                table: "ProjectBillPayments",
                newName: "Total");

            migrationBuilder.RenameColumn(
                name: "TDSAmount",
                table: "ProjectBillPayments",
                newName: "TDSRate");

            migrationBuilder.RenameColumn(
                name: "NetAmount",
                table: "ProjectBillPayments",
                newName: "TDS");
        }
    }
}
