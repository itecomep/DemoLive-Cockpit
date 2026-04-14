using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK007 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StateCode",
                table: "Projects");

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Segment",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Projects",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedMHr",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BillingTitle",
                table: "Projects",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AADHAR",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ARN",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FacadeArea",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "GSTIN",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GSTStateCode",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HSN",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "InteriorArea",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LandscapeArea",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "PAN",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PinCode",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TAN",
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

            migrationBuilder.CreateIndex(
                name: "IX_Projects_City",
                table: "Projects",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ContractCompletionDate",
                table: "Projects",
                column: "ContractCompletionDate");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ExpectedCompletionDate",
                table: "Projects",
                column: "ExpectedCompletionDate");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_InquiryConvertionDate",
                table: "Projects",
                column: "InquiryConvertionDate");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_PinCode",
                table: "Projects",
                column: "PinCode");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_State",
                table: "Projects",
                column: "State");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Projects_City",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ContractCompletionDate",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ExpectedCompletionDate",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_InquiryConvertionDate",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_PinCode",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_State",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "AADHAR",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ARN",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "FacadeArea",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GSTIN",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GSTStateCode",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "HSN",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "InteriorArea",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "LandscapeArea",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "PAN",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "PinCode",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "TAN",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "UDHYAM",
                table: "Projects");

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Segment",
                table: "Projects",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedMHr",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BillingTitle",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StateCode",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
