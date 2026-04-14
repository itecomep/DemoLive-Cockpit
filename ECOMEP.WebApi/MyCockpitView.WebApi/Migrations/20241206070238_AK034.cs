using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK034 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CompanyMSME",
                table: "ProjectBills",
                newName: "CompanyUDHYAM");

            migrationBuilder.RenameColumn(
                name: "MSME_UDHYAM",
                table: "Companies",
                newName: "UDHYAM");

            migrationBuilder.AddColumn<string>(
                name: "CompanyBank",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyBankAccount",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyBankBranch",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyBankIFSCCode",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyLogoUrl",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanySignStampUrl",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanySwiftCode",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyBank",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyBankAccount",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyBankBranch",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyBankIFSCCode",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyLogoUrl",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanySignStampUrl",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanySwiftCode",
                table: "ProjectBills");

            migrationBuilder.RenameColumn(
                name: "CompanyUDHYAM",
                table: "ProjectBills",
                newName: "CompanyMSME");

            migrationBuilder.RenameColumn(
                name: "UDHYAM",
                table: "Companies",
                newName: "MSME_UDHYAM");
        }
    }
}
