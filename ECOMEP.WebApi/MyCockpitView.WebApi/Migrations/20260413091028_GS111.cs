using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class GS111 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Visibility",
                table: "ProjectFolders");

            migrationBuilder.DropColumn(
                name: "Visibility",
                table: "ProjectFiles");

            migrationBuilder.CreateTable(
                name: "ProjectFileDenies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectFileDenies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectFileDenies_ProjectFiles_FileId",
                        column: x => x.FileId,
                        principalTable: "ProjectFiles",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectFolderDenies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FolderId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectFolderDenies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectFolderDenies_ProjectFolders_FolderId",
                        column: x => x.FolderId,
                        principalTable: "ProjectFolders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectFileDenies_FileId",
                table: "ProjectFileDenies",
                column: "FileId");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectFolderDenies_FolderId",
                table: "ProjectFolderDenies",
                column: "FolderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectFileDenies");

            migrationBuilder.DropTable(
                name: "ProjectFolderDenies");

            migrationBuilder.AddColumn<string>(
                name: "Visibility",
                table: "ProjectFolders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Visibility",
                table: "ProjectFiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
