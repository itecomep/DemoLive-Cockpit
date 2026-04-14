using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM093 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AssetAttributeMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Attribute = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    InputType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    InputOptions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_AssetAttributeMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Assets",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CodeFlag = table.Column<int>(type: "int", nullable: false),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    WarrantyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ValidityDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
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
                    table.PrimaryKey("PK_Assets", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AssetAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_AssetAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AssetAttachments_Assets_AssetID",
                        column: x => x.AssetID,
                        principalTable: "Assets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssetAttributes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetID = table.Column<int>(type: "int", nullable: false),
                    AttributeKey = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AttributeValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InputType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    InputOptions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_AssetAttributes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AssetAttributes_Assets_AssetID",
                        column: x => x.AssetID,
                        principalTable: "Assets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssetLinks",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrimaryAssetID = table.Column<int>(type: "int", nullable: false),
                    SecondaryAssetID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_AssetLinks", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AssetLinks_Assets_PrimaryAssetID",
                        column: x => x.PrimaryAssetID,
                        principalTable: "Assets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AssetLinks_Assets_SecondaryAssetID",
                        column: x => x.SecondaryAssetID,
                        principalTable: "Assets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AssetSchedules",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetID = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsRepeat = table.Column<bool>(type: "bit", nullable: false),
                    CronExpression = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NextScheduleDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpenseID = table.Column<int>(type: "int", nullable: true),
                    ResolutionMessage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    ParentVersionID = table.Column<int>(type: "int", nullable: true),
                    IsVersion = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_AssetSchedules", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AssetSchedules_Assets_AssetID",
                        column: x => x.AssetID,
                        principalTable: "Assets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssetSchedules_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "AssetVendors",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetID = table.Column<int>(type: "int", nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
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
                    table.PrimaryKey("PK_AssetVendors", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AssetVendors_Assets_AssetID",
                        column: x => x.AssetID,
                        principalTable: "Assets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AssetVendors_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "AssetScheduleAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssetScheduleID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_AssetScheduleAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AssetScheduleAttachments_AssetSchedules_AssetScheduleID",
                        column: x => x.AssetScheduleID,
                        principalTable: "AssetSchedules",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AssetScheduleComponents",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Component = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WarrantyDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ScheduleID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_AssetScheduleComponents", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AssetScheduleComponents_AssetSchedules_ScheduleID",
                        column: x => x.ScheduleID,
                        principalTable: "AssetSchedules",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_AssetID",
                table: "AssetAttachments",
                column: "AssetID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_Created",
                table: "AssetAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_CreatedByContactID",
                table: "AssetAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_Filename",
                table: "AssetAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_IsDeleted",
                table: "AssetAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_Modified",
                table: "AssetAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_ModifiedByContactID",
                table: "AssetAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_OrderFlag",
                table: "AssetAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_StatusFlag",
                table: "AssetAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_TypeFlag",
                table: "AssetAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttachments_UID",
                table: "AssetAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_Category",
                table: "AssetAttributeMasters",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_Created",
                table: "AssetAttributeMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_CreatedByContactID",
                table: "AssetAttributeMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_IsDeleted",
                table: "AssetAttributeMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_Modified",
                table: "AssetAttributeMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_ModifiedByContactID",
                table: "AssetAttributeMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_OrderFlag",
                table: "AssetAttributeMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_StatusFlag",
                table: "AssetAttributeMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_TypeFlag",
                table: "AssetAttributeMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributeMasters_UID",
                table: "AssetAttributeMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_AssetID",
                table: "AssetAttributes",
                column: "AssetID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_AttributeKey",
                table: "AssetAttributes",
                column: "AttributeKey");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_Created",
                table: "AssetAttributes",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_CreatedByContactID",
                table: "AssetAttributes",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_IsDeleted",
                table: "AssetAttributes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_Modified",
                table: "AssetAttributes",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_ModifiedByContactID",
                table: "AssetAttributes",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_OrderFlag",
                table: "AssetAttributes",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_StatusFlag",
                table: "AssetAttributes",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_TypeFlag",
                table: "AssetAttributes",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetAttributes_UID",
                table: "AssetAttributes",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_Created",
                table: "AssetLinks",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_CreatedByContactID",
                table: "AssetLinks",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_IsDeleted",
                table: "AssetLinks",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_Modified",
                table: "AssetLinks",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_ModifiedByContactID",
                table: "AssetLinks",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_OrderFlag",
                table: "AssetLinks",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_PrimaryAssetID",
                table: "AssetLinks",
                column: "PrimaryAssetID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_SecondaryAssetID",
                table: "AssetLinks",
                column: "SecondaryAssetID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_StatusFlag",
                table: "AssetLinks",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_TypeFlag",
                table: "AssetLinks",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetLinks_UID",
                table: "AssetLinks",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Category",
                table: "Assets",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Code",
                table: "Assets",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CodeFlag",
                table: "Assets",
                column: "CodeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Cost",
                table: "Assets",
                column: "Cost");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Created",
                table: "Assets",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CreatedByContactID",
                table: "Assets",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_IsDeleted",
                table: "Assets",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Modified",
                table: "Assets",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_ModifiedByContactID",
                table: "Assets",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_OrderFlag",
                table: "Assets",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_PurchaseDate",
                table: "Assets",
                column: "PurchaseDate");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Quantity",
                table: "Assets",
                column: "Quantity");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_StatusFlag",
                table: "Assets",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Subtitle",
                table: "Assets",
                column: "Subtitle");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Title",
                table: "Assets",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_TypeFlag",
                table: "Assets",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_UID",
                table: "Assets",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_ValidityDate",
                table: "Assets",
                column: "ValidityDate");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_WarrantyDate",
                table: "Assets",
                column: "WarrantyDate");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_AssetScheduleID",
                table: "AssetScheduleAttachments",
                column: "AssetScheduleID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_Created",
                table: "AssetScheduleAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_CreatedByContactID",
                table: "AssetScheduleAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_Filename",
                table: "AssetScheduleAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_IsDeleted",
                table: "AssetScheduleAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_Modified",
                table: "AssetScheduleAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_ModifiedByContactID",
                table: "AssetScheduleAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_OrderFlag",
                table: "AssetScheduleAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_StatusFlag",
                table: "AssetScheduleAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_TypeFlag",
                table: "AssetScheduleAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleAttachments_UID",
                table: "AssetScheduleAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_Created",
                table: "AssetScheduleComponents",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_CreatedByContactID",
                table: "AssetScheduleComponents",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_IsDeleted",
                table: "AssetScheduleComponents",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_Modified",
                table: "AssetScheduleComponents",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_ModifiedByContactID",
                table: "AssetScheduleComponents",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_OrderFlag",
                table: "AssetScheduleComponents",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_ScheduleID",
                table: "AssetScheduleComponents",
                column: "ScheduleID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_StatusFlag",
                table: "AssetScheduleComponents",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_TypeFlag",
                table: "AssetScheduleComponents",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_UID",
                table: "AssetScheduleComponents",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetScheduleComponents_WarrantyDate",
                table: "AssetScheduleComponents",
                column: "WarrantyDate");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_AssetID",
                table: "AssetSchedules",
                column: "AssetID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_ContactID",
                table: "AssetSchedules",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_Created",
                table: "AssetSchedules",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_CreatedByContactID",
                table: "AssetSchedules",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_CronExpression",
                table: "AssetSchedules",
                column: "CronExpression");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_EndDate",
                table: "AssetSchedules",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_IsDeleted",
                table: "AssetSchedules",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_IsRepeat",
                table: "AssetSchedules",
                column: "IsRepeat");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_Modified",
                table: "AssetSchedules",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_ModifiedByContactID",
                table: "AssetSchedules",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_NextScheduleDate",
                table: "AssetSchedules",
                column: "NextScheduleDate");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_OrderFlag",
                table: "AssetSchedules",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_StartDate",
                table: "AssetSchedules",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_StatusFlag",
                table: "AssetSchedules",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_Title",
                table: "AssetSchedules",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_TypeFlag",
                table: "AssetSchedules",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetSchedules_UID",
                table: "AssetSchedules",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_AssetID",
                table: "AssetVendors",
                column: "AssetID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_ContactID",
                table: "AssetVendors",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_Created",
                table: "AssetVendors",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_CreatedByContactID",
                table: "AssetVendors",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_IsDeleted",
                table: "AssetVendors",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_Modified",
                table: "AssetVendors",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_ModifiedByContactID",
                table: "AssetVendors",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_OrderFlag",
                table: "AssetVendors",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_StatusFlag",
                table: "AssetVendors",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_Title",
                table: "AssetVendors",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_TypeFlag",
                table: "AssetVendors",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssetVendors_UID",
                table: "AssetVendors",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssetAttachments");

            migrationBuilder.DropTable(
                name: "AssetAttributeMasters");

            migrationBuilder.DropTable(
                name: "AssetAttributes");

            migrationBuilder.DropTable(
                name: "AssetLinks");

            migrationBuilder.DropTable(
                name: "AssetScheduleAttachments");

            migrationBuilder.DropTable(
                name: "AssetScheduleComponents");

            migrationBuilder.DropTable(
                name: "AssetVendors");

            migrationBuilder.DropTable(
                name: "AssetSchedules");

            migrationBuilder.DropTable(
                name: "Assets");
        }
    }
}
