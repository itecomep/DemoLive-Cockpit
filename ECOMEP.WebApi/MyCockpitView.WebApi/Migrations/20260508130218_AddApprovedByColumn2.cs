using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovedByColumn2 : Migration
    {
        /// <inheritdoc />
        // protected override void Up(MigrationBuilder migrationBuilder)
        // {

        // }

        // /// <inheritdoc />
        // protected override void Down(MigrationBuilder migrationBuilder)
        // {

        // }



        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AddColumn<string>(
        name: "ApprovedBy",
        table: "Leaves",
        type: "nvarchar(max)",
        nullable: true);
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropColumn(
        name: "ApprovedBy",
        table: "Leaves");
}
    }
}
