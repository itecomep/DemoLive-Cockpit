using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK048 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SequenceNo",
                table: "ProjectWorkOrders");

            migrationBuilder.AlterColumn<string>(
                name: "AreaTitle",
                table: "ProjectWorkOrders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AreaTitle",
                table: "ProjectWorkOrders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SequenceNo",
                table: "ProjectWorkOrders",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }
    }
}
