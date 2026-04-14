using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class GS107 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DmsSubClassificationMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClassificationId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DmsSubClassificationMasters", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DmsSubClassificationMasters_DmsClassificationMasters_ClassificationId",
                        column: x => x.ClassificationId,
                        principalTable: "DmsClassificationMasters",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DmsSubSubClassificationMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubClassificationId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DmsSubSubClassificationMasters", x => x.ID);
                    table.ForeignKey(
                        name: "FK_DmsSubSubClassificationMasters_DmsSubClassificationMasters_SubClassificationId",
                        column: x => x.SubClassificationId,
                        principalTable: "DmsSubClassificationMasters",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DmsSubClassificationMasters_ClassificationId",
                table: "DmsSubClassificationMasters",
                column: "ClassificationId");

            migrationBuilder.CreateIndex(
                name: "IX_DmsSubSubClassificationMasters_SubClassificationId",
                table: "DmsSubSubClassificationMasters",
                column: "SubClassificationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DmsSubSubClassificationMasters");

            migrationBuilder.DropTable(
                name: "DmsSubClassificationMasters");
        }
    }
}
