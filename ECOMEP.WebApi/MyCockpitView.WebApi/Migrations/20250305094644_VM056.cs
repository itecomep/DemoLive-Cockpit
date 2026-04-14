using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM056 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "BillingDate",
                table: "ProjectStages",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaymentReceivedDate",
                table: "ProjectStages",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_BillingDate",
                table: "ProjectStages",
                column: "BillingDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_PaymentReceivedDate",
                table: "ProjectStages",
                column: "PaymentReceivedDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectStages_BillingDate",
                table: "ProjectStages");

            migrationBuilder.DropIndex(
                name: "IX_ProjectStages_PaymentReceivedDate",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "BillingDate",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "PaymentReceivedDate",
                table: "ProjectStages");
        }
    }
}
