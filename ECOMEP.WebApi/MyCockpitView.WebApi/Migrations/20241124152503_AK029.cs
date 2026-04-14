using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK029 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GSTIN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "HSN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "PAN",
                table: "ProjectBills");

            migrationBuilder.RenameColumn(
                name: "TAN",
                table: "ProjectBills",
                newName: "CompanyAddress");

            migrationBuilder.RenameColumn(
                name: "StateCode",
                table: "ProjectBills",
                newName: "CompanyTAN");

            migrationBuilder.AlterColumn<string>(
                name: "ClientName",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientGSTIN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ClientGSTStateCode",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ClientHSN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientPAN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientTAN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyGSTIN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyGSTStateCode",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyHSN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyID",
                table: "ProjectBills",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyMSME",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyPAN",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TAN",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PAN",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HSN",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GSTIN",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BankIFSCCode",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BankAccount",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bank",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MSME",
                table: "Companies",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SignStampUrl",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientGSTIN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ClientGSTStateCode",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ClientHSN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ClientPAN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ClientTAN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyGSTIN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyGSTStateCode",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyHSN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyID",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyMSME",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "CompanyPAN",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "MSME",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "SignStampUrl",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "CompanyTAN",
                table: "ProjectBills",
                newName: "StateCode");

            migrationBuilder.RenameColumn(
                name: "CompanyAddress",
                table: "ProjectBills",
                newName: "TAN");

            migrationBuilder.AlterColumn<string>(
                name: "ClientName",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<string>(
                name: "GSTIN",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HSN",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PAN",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TAN",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PAN",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "HSN",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GSTIN",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BankIFSCCode",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BankAccount",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bank",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);
        }
    }
}
