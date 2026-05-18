using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class GS112 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "OfficeLocation",
            //    table: "Projects");

            //migrationBuilder.DropColumn(
            //    name: "SiteLocation",
            //    table: "Projects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<string>(
            //    name: "OfficeLocation",
            //    table: "Projects",
            //    type: "nvarchar(255)",
            //    maxLength: 255,
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "SiteLocation",
            //    table: "Projects",
            //    type: "nvarchar(255)",
            //    maxLength: 255,
            //    nullable: true);
        }
    }
}
