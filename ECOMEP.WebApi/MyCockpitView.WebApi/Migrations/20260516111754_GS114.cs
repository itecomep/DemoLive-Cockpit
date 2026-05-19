using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class GS114 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AddColumn<string>(
            //    name: "Attachment",
            //    table: "ProjectTargets",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "ApprovedBy",
            //    table: "Leaves",
            //    type: "nvarchar(max)",
            //    nullable: true);

            //migrationBuilder.AddColumn<string>(
            //    name: "Card_No",
            //    table: "Contacts",
            //    type: "nvarchar(255)",
            //    maxLength: 255,
            //    nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropColumn(
            //    name: "Attachment",
            //    table: "ProjectTargets");

            //migrationBuilder.DropColumn(
            //    name: "ApprovedBy",
            //    table: "Leaves");

            //migrationBuilder.DropColumn(
            //    name: "Card_No",
            //    table: "Contacts");
        }
    }
}
