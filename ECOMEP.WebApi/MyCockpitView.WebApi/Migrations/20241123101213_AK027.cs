using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK027 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Tax",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "TaxSplit",
                table: "ProjectBills");

            migrationBuilder.RenameColumn(
                name: "TaxRate",
                table: "ProjectBills",
                newName: "ProjectFee");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProjectFee",
                table: "ProjectBills",
                newName: "TaxRate");

            migrationBuilder.AddColumn<decimal>(
                name: "Tax",
                table: "ProjectBills",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "TaxSplit",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
