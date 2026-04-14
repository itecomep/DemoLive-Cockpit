using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM074 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocumentsCarriedJson",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GmapsJson",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Purpose",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Remark",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isRecipient",
                table: "MeetingAttendees",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocumentsCarriedJson",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "GmapsJson",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "Purpose",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "Remark",
                table: "Meetings");

            migrationBuilder.DropColumn(
                name: "isRecipient",
                table: "MeetingAttendees");
        }
    }
}
