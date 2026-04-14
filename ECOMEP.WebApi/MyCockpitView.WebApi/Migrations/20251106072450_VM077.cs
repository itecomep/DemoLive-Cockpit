using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM077 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MeetingVouchers",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingID = table.Column<int>(type: "int", nullable: false),
                    ExpenseAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ExpenseHead = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Particulars = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingVouchers", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MeetingVouchers_Meetings_MeetingID",
                        column: x => x.MeetingID,
                        principalTable: "Meetings",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingVoucherAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingVoucherID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_MeetingVoucherAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MeetingVoucherAttachments_MeetingVouchers_MeetingVoucherID",
                        column: x => x.MeetingVoucherID,
                        principalTable: "MeetingVouchers",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_Created",
                table: "MeetingVoucherAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_CreatedByContactID",
                table: "MeetingVoucherAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_Filename",
                table: "MeetingVoucherAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_IsDeleted",
                table: "MeetingVoucherAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_MeetingVoucherID",
                table: "MeetingVoucherAttachments",
                column: "MeetingVoucherID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_Modified",
                table: "MeetingVoucherAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_ModifiedByContactID",
                table: "MeetingVoucherAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_OrderFlag",
                table: "MeetingVoucherAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_StatusFlag",
                table: "MeetingVoucherAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_TypeFlag",
                table: "MeetingVoucherAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVoucherAttachments_UID",
                table: "MeetingVoucherAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_Created",
                table: "MeetingVouchers",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_CreatedByContactID",
                table: "MeetingVouchers",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_ExpenseAmount",
                table: "MeetingVouchers",
                column: "ExpenseAmount");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_ExpenseHead",
                table: "MeetingVouchers",
                column: "ExpenseHead");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_IsDeleted",
                table: "MeetingVouchers",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_MeetingID",
                table: "MeetingVouchers",
                column: "MeetingID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_Modified",
                table: "MeetingVouchers",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_ModifiedByContactID",
                table: "MeetingVouchers",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_OrderFlag",
                table: "MeetingVouchers",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_Particulars",
                table: "MeetingVouchers",
                column: "Particulars");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_StatusFlag",
                table: "MeetingVouchers",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_TypeFlag",
                table: "MeetingVouchers",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingVouchers_UID",
                table: "MeetingVouchers",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeetingVoucherAttachments");

            migrationBuilder.DropTable(
                name: "MeetingVouchers");
        }
    }
}
