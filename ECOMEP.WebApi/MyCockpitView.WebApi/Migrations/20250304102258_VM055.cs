using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM055 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactWorkOrderPayments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Mode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TDSAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    IsTDSPaid = table.Column<bool>(type: "bit", nullable: false),
                    TDSShare = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NetAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    AdjustmentAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ExchangeRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransactionNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransactionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BankDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefGuid = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactWorkOrderPayments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactWorkOrderPayments_ContactWorkOrders_ContactWorkOrderID",
                        column: x => x.ContactWorkOrderID,
                        principalTable: "ContactWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactWorkOrderPaymentAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactWorkOrderPaymentID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ContactWorkOrderPaymentAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactWorkOrderPaymentAttachments_ContactWorkOrderPayments_ContactWorkOrderPaymentID",
                        column: x => x.ContactWorkOrderPaymentID,
                        principalTable: "ContactWorkOrderPayments",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_ContactWorkOrderPaymentID",
                table: "ContactWorkOrderPaymentAttachments",
                column: "ContactWorkOrderPaymentID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_Created",
                table: "ContactWorkOrderPaymentAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_CreatedByContactID",
                table: "ContactWorkOrderPaymentAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_Filename",
                table: "ContactWorkOrderPaymentAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_IsDeleted",
                table: "ContactWorkOrderPaymentAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_Modified",
                table: "ContactWorkOrderPaymentAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_ModifiedByContactID",
                table: "ContactWorkOrderPaymentAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_OrderFlag",
                table: "ContactWorkOrderPaymentAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_StatusFlag",
                table: "ContactWorkOrderPaymentAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_TypeFlag",
                table: "ContactWorkOrderPaymentAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPaymentAttachments_UID",
                table: "ContactWorkOrderPaymentAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_ContactWorkOrderID",
                table: "ContactWorkOrderPayments",
                column: "ContactWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_Created",
                table: "ContactWorkOrderPayments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_CreatedByContactID",
                table: "ContactWorkOrderPayments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_IsDeleted",
                table: "ContactWorkOrderPayments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_Modified",
                table: "ContactWorkOrderPayments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_ModifiedByContactID",
                table: "ContactWorkOrderPayments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_OrderFlag",
                table: "ContactWorkOrderPayments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_StatusFlag",
                table: "ContactWorkOrderPayments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_TypeFlag",
                table: "ContactWorkOrderPayments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactWorkOrderPayments_UID",
                table: "ContactWorkOrderPayments",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactWorkOrderPaymentAttachments");

            migrationBuilder.DropTable(
                name: "ContactWorkOrderPayments");
        }
    }
}
