using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK028 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GSTAmount",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "GSTFlag",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "GSTShare",
                table: "ProjectBills");

            migrationBuilder.AlterColumn<string>(
                name: "BillNo",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsIGSTApplicable",
                table: "ProjectBills",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "BankAccount",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsIGSTApplicable",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "BankAccount",
                table: "Companies");

            migrationBuilder.AlterColumn<string>(
                name: "BillNo",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<decimal>(
                name: "GSTAmount",
                table: "ProjectBills",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "GSTFlag",
                table: "ProjectBills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "GSTShare",
                table: "ProjectBills",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }
    }
}
