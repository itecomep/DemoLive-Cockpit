using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM081 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Companies_CompanyID",
                table: "WorkOrders");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "WorkOrders",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Companies_CompanyID",
                table: "WorkOrders",
                column: "CompanyID",
                principalTable: "Companies",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Companies_CompanyID",
                table: "WorkOrders");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "WorkOrders",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Companies_CompanyID",
                table: "WorkOrders",
                column: "CompanyID",
                principalTable: "Companies",
                principalColumn: "ID");
        }
    }
}
