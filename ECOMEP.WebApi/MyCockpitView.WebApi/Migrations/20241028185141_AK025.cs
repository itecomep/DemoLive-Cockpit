using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK025 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReceivedDate",
                table: "ProjectAttachments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReceivedFromContactID",
                table: "ProjectAttachments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceivedFromContactName",
                table: "ProjectAttachments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "ProjectAttachments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivedDate",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "ReceivedFromContactID",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "ReceivedFromContactName",
                table: "ProjectAttachments");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "ProjectAttachments");
        }
    }
}
