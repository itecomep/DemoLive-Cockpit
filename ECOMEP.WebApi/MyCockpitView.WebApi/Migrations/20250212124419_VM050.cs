using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM050 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ActivityAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActivityID = table.Column<int>(type: "int", nullable: false),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    IsFolder = table.Column<bool>(type: "bit", nullable: false),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    FolderPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ActivityAttachments_Activities_ActivityID",
                        column: x => x.ActivityID,
                        principalTable: "Activities",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_ActivityID",
                table: "ActivityAttachments",
                column: "ActivityID");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_Created",
                table: "ActivityAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_CreatedByContactID",
                table: "ActivityAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_Filename",
                table: "ActivityAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_IsDeleted",
                table: "ActivityAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_Modified",
                table: "ActivityAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_ModifiedByContactID",
                table: "ActivityAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_OrderFlag",
                table: "ActivityAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_StatusFlag",
                table: "ActivityAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_TypeFlag",
                table: "ActivityAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttachments_UID",
                table: "ActivityAttachments",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityAttachments");
        }
    }
}
