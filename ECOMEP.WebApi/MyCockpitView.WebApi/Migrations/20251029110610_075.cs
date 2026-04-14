using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class _075 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MeetingAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_MeetingAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MeetingAttachments_Meetings_MeetingID",
                        column: x => x.MeetingID,
                        principalTable: "Meetings",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_Created",
                table: "MeetingAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_CreatedByContactID",
                table: "MeetingAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_Filename",
                table: "MeetingAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_IsDeleted",
                table: "MeetingAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_MeetingID",
                table: "MeetingAttachments",
                column: "MeetingID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_Modified",
                table: "MeetingAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_ModifiedByContactID",
                table: "MeetingAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_OrderFlag",
                table: "MeetingAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_StatusFlag",
                table: "MeetingAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_TypeFlag",
                table: "MeetingAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttachments_UID",
                table: "MeetingAttachments",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeetingAttachments");
        }
    }
}
