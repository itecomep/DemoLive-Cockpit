using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK036 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClientContactID",
                table: "ProjectWorkOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyID",
                table: "ProjectWorkOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SequenceNo",
                table: "ProjectWorkOrders",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "WorkOrderDate",
                table: "ProjectBills",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientContactID",
                table: "ProjectWorkOrders");

            migrationBuilder.DropColumn(
                name: "CompanyID",
                table: "ProjectWorkOrders");

            migrationBuilder.DropColumn(
                name: "SequenceNo",
                table: "ProjectWorkOrders");

            migrationBuilder.AlterColumn<string>(
                name: "WorkOrderDate",
                table: "ProjectBills",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
