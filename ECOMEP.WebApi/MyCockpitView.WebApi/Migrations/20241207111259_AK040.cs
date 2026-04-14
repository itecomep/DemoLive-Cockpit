using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK040 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectBills_BillNo",
                table: "ProjectBills");


            migrationBuilder.AddColumn<string>(
                name: "ProformaInvoiceNo",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxInvoiceNo",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_ProformaInvoiceNo",
                table: "ProjectBills",
                column: "ProformaInvoiceNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_TaxInvoiceNo",
                table: "ProjectBills",
                column: "TaxInvoiceNo");

            migrationBuilder.Sql("Update projectbills set ProformaInvoiceNo=billNo");

            migrationBuilder.DropColumn(
                name: "BillNo",
                table: "ProjectBills");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectBills_ProformaInvoiceNo",
                table: "ProjectBills");

            migrationBuilder.DropIndex(
                name: "IX_ProjectBills_TaxInvoiceNo",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "ProformaInvoiceNo",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "TaxInvoiceNo",
                table: "ProjectBills");

            migrationBuilder.AddColumn<string>(
                name: "BillNo",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_BillNo",
                table: "ProjectBills",
                column: "BillNo");
        }
    }
}
