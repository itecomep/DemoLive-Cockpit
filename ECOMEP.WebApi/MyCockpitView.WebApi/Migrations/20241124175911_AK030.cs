using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK030 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AADHAR",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "UDHYAM",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ClientHSN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "Payable",
                table: "ProjectBills");

            migrationBuilder.RenameColumn(
                name: "TotalAreaOfConstructon",
                table: "ProjectBills",
                newName: "PreviousBillAmount");

            migrationBuilder.RenameColumn(
                name: "TotalAreaFees",
                table: "ProjectBills",
                newName: "PayableAmount");

            migrationBuilder.RenameColumn(
                name: "Total",
                table: "ProjectBills",
                newName: "DueAmount");

            migrationBuilder.RenameColumn(
                name: "PreviousAmount",
                table: "ProjectBills",
                newName: "BillAmount");

            migrationBuilder.RenameColumn(
                name: "CompanyHSN",
                table: "ProjectBills",
                newName: "HSN");

            migrationBuilder.RenameColumn(
                name: "HSN",
                table: "Contacts",
                newName: "GSTStateCode");

            migrationBuilder.RenameColumn(
                name: "MSME",
                table: "Companies",
                newName: "SwiftCode");

            migrationBuilder.RenameColumn(
                name: "HSN",
                table: "Companies",
                newName: "MSME_UDHYAM");

            migrationBuilder.AddColumn<int>(
                name: "ClientContactID",
                table: "ProjectBills",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectCode",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectLocation",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectTitle",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GSTStateCode",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientContactID",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ProjectCode",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ProjectLocation",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ProjectTitle",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "GSTStateCode",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "PreviousBillAmount",
                table: "ProjectBills",
                newName: "TotalAreaOfConstructon");

            migrationBuilder.RenameColumn(
                name: "PayableAmount",
                table: "ProjectBills",
                newName: "TotalAreaFees");

            migrationBuilder.RenameColumn(
                name: "HSN",
                table: "ProjectBills",
                newName: "CompanyHSN");

            migrationBuilder.RenameColumn(
                name: "DueAmount",
                table: "ProjectBills",
                newName: "Total");

            migrationBuilder.RenameColumn(
                name: "BillAmount",
                table: "ProjectBills",
                newName: "PreviousAmount");

            migrationBuilder.RenameColumn(
                name: "GSTStateCode",
                table: "Contacts",
                newName: "HSN");

            migrationBuilder.RenameColumn(
                name: "SwiftCode",
                table: "Companies",
                newName: "MSME");

            migrationBuilder.RenameColumn(
                name: "MSME_UDHYAM",
                table: "Companies",
                newName: "HSN");

            migrationBuilder.AddColumn<string>(
                name: "AADHAR",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UDHYAM",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "ProjectBills",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ClientHSN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Payable",
                table: "ProjectBills",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }
    }
}
