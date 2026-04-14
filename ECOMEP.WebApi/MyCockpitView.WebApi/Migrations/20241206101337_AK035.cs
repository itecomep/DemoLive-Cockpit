using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK035 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectWorkOrderID",
                table: "ProjectBills",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkOrderDate",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkOrderNo",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectWorkOrderID",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "WorkOrderDate",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "WorkOrderNo",
                table: "ProjectBills");
        }
    }
}
