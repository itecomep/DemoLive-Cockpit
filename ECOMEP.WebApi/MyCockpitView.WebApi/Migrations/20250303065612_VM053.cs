using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM053 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactWorkOrders",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Share = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    WorkOrderNo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    WorkOrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WorkDetail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    BlobUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactWorkOrders", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactWorkOrders_Contacts_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Contacts",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ContactWorkOrders_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactWorkOrderAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactWorkOrderID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ContactWorkOrderAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactWorkOrderAttachments_ContactWorkOrders_ContactWorkOrderID",
                        column: x => x.ContactWorkOrderID,
                        principalTable: "ContactWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_ContactWorkOrderID",
                table: "ContactWorkOrderAttachments",
                column: "ContactWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_Created",
                table: "ContactWorkOrderAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_CreatedByContactID",
                table: "ContactWorkOrderAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_Filename",
                table: "ContactWorkOrderAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_IsDeleted",
                table: "ContactWorkOrderAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_Modified",
                table: "ContactWorkOrderAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_ModifiedByContactID",
                table: "ContactWorkOrderAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_OrderFlag",
                table: "ContactWorkOrderAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_StatusFlag",
                table: "ContactWorkOrderAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_TypeFlag",
                table: "ContactWorkOrderAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderAttachments_UID",
                table: "ContactWorkOrderAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_CompanyID",
                table: "ContactWorkOrders",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_ContactID",
                table: "ContactWorkOrders",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_Created",
                table: "ContactWorkOrders",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_CreatedByContactID",
                table: "ContactWorkOrders",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_IsDeleted",
                table: "ContactWorkOrders",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_Modified",
                table: "ContactWorkOrders",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_ModifiedByContactID",
                table: "ContactWorkOrders",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_OrderFlag",
                table: "ContactWorkOrders",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_StatusFlag",
                table: "ContactWorkOrders",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_TypeFlag",
                table: "ContactWorkOrders",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_UID",
                table: "ContactWorkOrders",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrders_WorkOrderNo",
                table: "ContactWorkOrders",
                column: "WorkOrderNo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactWorkOrderAttachments");

            migrationBuilder.DropTable(
                name: "ContactWorkOrders");
        }
    }
}
