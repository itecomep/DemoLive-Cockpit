using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class PC095 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LeaveAttachment",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LeaveID = table.Column<int>(type: "int", nullable: false),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    ParentVersionID = table.Column<int>(type: "int", nullable: true),
                    IsVersion = table.Column<bool>(type: "bit", nullable: false),
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
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsProcessed = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveAttachment", x => x.ID);
                    table.ForeignKey(
                        name: "FK_LeaveAttachment_Leaves_LeaveID",
                        column: x => x.LeaveID,
                        principalTable: "Leaves",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_Created",
                table: "LeaveAttachment",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_CreatedByContactID",
                table: "LeaveAttachment",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_Filename",
                table: "LeaveAttachment",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_IsDeleted",
                table: "LeaveAttachment",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_LeaveID",
                table: "LeaveAttachment",
                column: "LeaveID");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_Modified",
                table: "LeaveAttachment",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_ModifiedByContactID",
                table: "LeaveAttachment",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_OrderFlag",
                table: "LeaveAttachment",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_StatusFlag",
                table: "LeaveAttachment",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_TypeFlag",
                table: "LeaveAttachment",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveAttachment_UID",
                table: "LeaveAttachment",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LeaveAttachment");
        }
    }
}
