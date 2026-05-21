using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class GS118 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DepartmentID",
                table: "ContactAppointments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_DepartmentID",
                table: "ContactAppointments",
                column: "DepartmentID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAppointments_Departments_DepartmentID",
                table: "ContactAppointments",
                column: "DepartmentID",
                principalTable: "Departments",
                principalColumn: "ID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactAppointments_Departments_DepartmentID",
                table: "ContactAppointments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointments_DepartmentID",
                table: "ContactAppointments");

            migrationBuilder.DropColumn(
                name: "DepartmentID",
                table: "ContactAppointments");
        }
    }
}
