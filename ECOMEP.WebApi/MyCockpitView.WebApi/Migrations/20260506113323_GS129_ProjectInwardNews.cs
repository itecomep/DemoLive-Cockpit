// using Microsoft.EntityFrameworkCore.Migrations;

// #nullable disable

// namespace MyCockpitView.WebApi.Migrations
// {
//     /// <inheritdoc />
//     public partial class GS129_ProjectInwardNews : Migration
//     {
//         /// <inheritdoc />
//         protected override void Up(MigrationBuilder migrationBuilder)
//         {

//         }

//         /// <inheritdoc />
//         protected override void Down(MigrationBuilder migrationBuilder)
//         {

//         }
//     }
// }













using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    public partial class GS129_ProjectInwardNews : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectInwardNews",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),

                    Title = table.Column<string>(
                        type: "nvarchar(max)",
                        nullable: true
                    ),

                    Message = table.Column<string>(
                        type: "nvarchar(max)",
                        nullable: true
                    ),

                    Category = table.Column<string>(
                        type: "nvarchar(max)",
                        nullable: true
                    ),

                    ReceivedDate = table.Column<DateTime>(
                        type: "datetime2",
                        nullable: false
                    ),

                    ContactID = table.Column<int>(
                        type: "int",
                        nullable: true
                    ),

                    ProjectID = table.Column<int>(
                        type: "int",
                        nullable: true
                    ),

                    AttachmentPath = table.Column<string>(
                        type: "nvarchar(max)",
                        nullable: true
                    )
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_ProjectInwardNews",
                        x => x.ID
                    );
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectInwardNews"
            );
        }
    }
}