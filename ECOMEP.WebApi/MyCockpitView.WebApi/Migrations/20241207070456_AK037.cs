using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK037 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BlobUrlWithoutLetterHead",
                table: "ProjectBills",
                newName: "TaxInvoiceUrl");

            migrationBuilder.RenameColumn(
                name: "BlobUrl",
                table: "ProjectBills",
                newName: "ProformaInvoiceUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TaxInvoiceUrl",
                table: "ProjectBills",
                newName: "BlobUrlWithoutLetterHead");

            migrationBuilder.RenameColumn(
                name: "ProformaInvoiceUrl",
                table: "ProjectBills",
                newName: "BlobUrl");
        }
    }
}
