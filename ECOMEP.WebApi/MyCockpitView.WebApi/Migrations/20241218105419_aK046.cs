using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class aK046 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProjectBills_SequenceNo",
                table: "ProjectBills");

            migrationBuilder.DropColumn(
                name: "SequenceNo",
                table: "ProjectBills");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ProformaDate",
                table: "ProjectBills",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "IsPostDated",
                table: "ProjectBills",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPostDated",
                table: "ProjectBills");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ProformaDate",
                table: "ProjectBills",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SequenceNo",
                table: "ProjectBills",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_SequenceNo",
                table: "ProjectBills",
                column: "SequenceNo");
        }
    }
}
