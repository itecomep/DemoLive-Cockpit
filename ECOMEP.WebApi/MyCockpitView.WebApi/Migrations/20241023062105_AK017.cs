using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK017 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpecificationAccessories");

            migrationBuilder.DropTable(
                name: "SpecificationAreaAttachments");

            migrationBuilder.DropTable(
                name: "SpecificationAttachments");

            migrationBuilder.DropTable(
                name: "SpecificationAttributeMasters");

            migrationBuilder.DropTable(
                name: "SpecificationAttributes");

            migrationBuilder.DropTable(
                name: "SpecificationLibraryEntityAttachments");

            migrationBuilder.DropTable(
                name: "SpecificationLibraryEntityAttributes");

            migrationBuilder.DropTable(
                name: "SpecificationLinearSegments");

            migrationBuilder.DropTable(
                name: "SpecificationLibraryEntities");

            migrationBuilder.DropTable(
                name: "Specifications");

            migrationBuilder.DropTable(
                name: "SpecificationAreas");

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Template = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
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
                    table.PrimaryKey("PK_ProjectWorkOrderMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrders",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AreaTitle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Share = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    WorkOrderNo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WorkOrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WorkDetail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WorkProposalTemplate = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    InteriorCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BlobUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_ProjectWorkOrders", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrders_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderSegmentMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectWorkOrderMasterID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_ProjectWorkOrderSegmentMasters", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderSegmentMasters_ProjectWorkOrderMasters_ProjectWorkOrderMasterID",
                        column: x => x.ProjectWorkOrderMasterID,
                        principalTable: "ProjectWorkOrderMasters",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderAreas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AreaTitle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Share = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProjectWorkOrderID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectWorkOrderAreas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderAreas_ProjectWorkOrders_ProjectWorkOrderID",
                        column: x => x.ProjectWorkOrderID,
                        principalTable: "ProjectWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderAttachements",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectWorkOrderID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectWorkOrderAttachements", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderAttachements_ProjectWorkOrders_ProjectWorkOrderID",
                        column: x => x.ProjectWorkOrderID,
                        principalTable: "ProjectWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderSegments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectWorkOrderID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectWorkOrderSegments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderSegments_ProjectWorkOrders_ProjectWorkOrderID",
                        column: x => x.ProjectWorkOrderID,
                        principalTable: "ProjectWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_Created",
                table: "ProjectWorkOrderAreas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_CreatedByContactID",
                table: "ProjectWorkOrderAreas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_IsDeleted",
                table: "ProjectWorkOrderAreas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_Modified",
                table: "ProjectWorkOrderAreas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_ModifiedByContactID",
                table: "ProjectWorkOrderAreas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_OrderFlag",
                table: "ProjectWorkOrderAreas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_ProjectWorkOrderID",
                table: "ProjectWorkOrderAreas",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_StatusFlag",
                table: "ProjectWorkOrderAreas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_TypeFlag",
                table: "ProjectWorkOrderAreas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_UID",
                table: "ProjectWorkOrderAreas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_Created",
                table: "ProjectWorkOrderAttachements",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_CreatedByContactID",
                table: "ProjectWorkOrderAttachements",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_Filename",
                table: "ProjectWorkOrderAttachements",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_IsDeleted",
                table: "ProjectWorkOrderAttachements",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_Modified",
                table: "ProjectWorkOrderAttachements",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_ModifiedByContactID",
                table: "ProjectWorkOrderAttachements",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_OrderFlag",
                table: "ProjectWorkOrderAttachements",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_ProjectWorkOrderID",
                table: "ProjectWorkOrderAttachements",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_StatusFlag",
                table: "ProjectWorkOrderAttachements",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_TypeFlag",
                table: "ProjectWorkOrderAttachements",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachements_UID",
                table: "ProjectWorkOrderAttachements",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_Created",
                table: "ProjectWorkOrderMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_CreatedByContactID",
                table: "ProjectWorkOrderMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_IsDeleted",
                table: "ProjectWorkOrderMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_Modified",
                table: "ProjectWorkOrderMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_ModifiedByContactID",
                table: "ProjectWorkOrderMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_OrderFlag",
                table: "ProjectWorkOrderMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_StatusFlag",
                table: "ProjectWorkOrderMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_TypeFlag",
                table: "ProjectWorkOrderMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_UID",
                table: "ProjectWorkOrderMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_Created",
                table: "ProjectWorkOrders",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_CreatedByContactID",
                table: "ProjectWorkOrders",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_IsDeleted",
                table: "ProjectWorkOrders",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_Modified",
                table: "ProjectWorkOrders",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_ModifiedByContactID",
                table: "ProjectWorkOrders",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_OrderFlag",
                table: "ProjectWorkOrders",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_ProjectID",
                table: "ProjectWorkOrders",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_StatusFlag",
                table: "ProjectWorkOrders",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_TypeFlag",
                table: "ProjectWorkOrders",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_UID",
                table: "ProjectWorkOrders",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_Created",
                table: "ProjectWorkOrderSegmentMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_CreatedByContactID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_IsDeleted",
                table: "ProjectWorkOrderSegmentMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_Modified",
                table: "ProjectWorkOrderSegmentMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_ModifiedByContactID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_OrderFlag",
                table: "ProjectWorkOrderSegmentMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_ProjectWorkOrderMasterID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "ProjectWorkOrderMasterID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_StatusFlag",
                table: "ProjectWorkOrderSegmentMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_TypeFlag",
                table: "ProjectWorkOrderSegmentMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_UID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_Created",
                table: "ProjectWorkOrderSegments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_CreatedByContactID",
                table: "ProjectWorkOrderSegments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_IsDeleted",
                table: "ProjectWorkOrderSegments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_Modified",
                table: "ProjectWorkOrderSegments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_ModifiedByContactID",
                table: "ProjectWorkOrderSegments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_OrderFlag",
                table: "ProjectWorkOrderSegments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_ProjectWorkOrderID",
                table: "ProjectWorkOrderSegments",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_StatusFlag",
                table: "ProjectWorkOrderSegments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_TypeFlag",
                table: "ProjectWorkOrderSegments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_UID",
                table: "ProjectWorkOrderSegments",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectWorkOrderAreas");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderAttachements");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderSegmentMasters");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderSegments");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderMasters");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrders");

            migrationBuilder.CreateTable(
                name: "SpecificationAreas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    Area = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ProjectAreaID = table.Column<int>(type: "int", nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAreas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAreas_SpecificationAreas_ParentID",
                        column: x => x.ParentID,
                        principalTable: "SpecificationAreas",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAttributeMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Attribute = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Group = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    GroupHint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HideCondition = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Input = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    Max = table.Column<int>(type: "int", nullable: true),
                    Min = table.Column<int>(type: "int", nullable: true),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    Options = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ShowInList = table.Column<bool>(type: "bit", nullable: false),
                    ShowInReport = table.Column<bool>(type: "bit", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAttributeMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLibraryEntities",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CodeFlag = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Subtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationLibraryEntities", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAreaAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationAreaID = table.Column<int>(type: "int", nullable: false),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAreaAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAreaAttachments_SpecificationAreas_SpecificationAreaID",
                        column: x => x.SpecificationAreaID,
                        principalTable: "SpecificationAreas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Specifications",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    SpecificationAreaID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Currency = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FixtureScheduleTime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReferenceTag = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RevisionNumber = table.Column<int>(type: "int", nullable: false),
                    SpecificationMasterID = table.Column<int>(type: "int", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SymbolUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specifications", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Specifications_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Specifications_SpecificationAreas_SpecificationAreaID",
                        column: x => x.SpecificationAreaID,
                        principalTable: "SpecificationAreas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLibraryEntityAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationLibraryEntityID = table.Column<int>(type: "int", nullable: false),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationLibraryEntityAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationLibraryEntityAttachments_SpecificationLibraryEntities_SpecificationLibraryEntityID",
                        column: x => x.SpecificationLibraryEntityID,
                        principalTable: "SpecificationLibraryEntities",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLibraryEntityAttributes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationLibraryEntityID = table.Column<int>(type: "int", nullable: false),
                    AttributeKey = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AttributeValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Group = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SpecificationAttributeMasterID = table.Column<int>(type: "int", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationLibraryEntityAttributes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationLibraryEntityAttributes_SpecificationLibraryEntities_SpecificationLibraryEntityID",
                        column: x => x.SpecificationLibraryEntityID,
                        principalTable: "SpecificationLibraryEntities",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAccessories",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAccessories", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAccessories_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAttachments_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAttributes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
                    AttributeKey = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AttributeValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Group = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SpecificationAttributeMasterID = table.Column<int>(type: "int", nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAttributes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAttributes_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLinearSegments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Increment = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OptimumLength = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    SurfaceLength = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationLinearSegments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationLinearSegments_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_Created",
                table: "SpecificationAccessories",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_CreatedByContactID",
                table: "SpecificationAccessories",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_IsDeleted",
                table: "SpecificationAccessories",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_Modified",
                table: "SpecificationAccessories",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_ModifiedByContactID",
                table: "SpecificationAccessories",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_OrderFlag",
                table: "SpecificationAccessories",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_SpecificationID",
                table: "SpecificationAccessories",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_StatusFlag",
                table: "SpecificationAccessories",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_Title",
                table: "SpecificationAccessories",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_TypeFlag",
                table: "SpecificationAccessories",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_UID",
                table: "SpecificationAccessories",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_Created",
                table: "SpecificationAreaAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_CreatedByContactID",
                table: "SpecificationAreaAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_Filename",
                table: "SpecificationAreaAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_IsDeleted",
                table: "SpecificationAreaAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_Modified",
                table: "SpecificationAreaAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_ModifiedByContactID",
                table: "SpecificationAreaAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_OrderFlag",
                table: "SpecificationAreaAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_SpecificationAreaID",
                table: "SpecificationAreaAttachments",
                column: "SpecificationAreaID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_StatusFlag",
                table: "SpecificationAreaAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_TypeFlag",
                table: "SpecificationAreaAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_UID",
                table: "SpecificationAreaAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_Created",
                table: "SpecificationAreas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_CreatedByContactID",
                table: "SpecificationAreas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_IsDeleted",
                table: "SpecificationAreas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_Modified",
                table: "SpecificationAreas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_ModifiedByContactID",
                table: "SpecificationAreas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_OrderFlag",
                table: "SpecificationAreas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_ParentID",
                table: "SpecificationAreas",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_StatusFlag",
                table: "SpecificationAreas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_Title",
                table: "SpecificationAreas",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_TypeFlag",
                table: "SpecificationAreas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_UID",
                table: "SpecificationAreas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_Created",
                table: "SpecificationAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_CreatedByContactID",
                table: "SpecificationAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_Filename",
                table: "SpecificationAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_IsDeleted",
                table: "SpecificationAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_Modified",
                table: "SpecificationAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_ModifiedByContactID",
                table: "SpecificationAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_OrderFlag",
                table: "SpecificationAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_SpecificationID",
                table: "SpecificationAttachments",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_StatusFlag",
                table: "SpecificationAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_TypeFlag",
                table: "SpecificationAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_UID",
                table: "SpecificationAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_Attribute",
                table: "SpecificationAttributeMasters",
                column: "Attribute");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_Created",
                table: "SpecificationAttributeMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_CreatedByContactID",
                table: "SpecificationAttributeMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_IsDeleted",
                table: "SpecificationAttributeMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_IsRequired",
                table: "SpecificationAttributeMasters",
                column: "IsRequired");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_Modified",
                table: "SpecificationAttributeMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_ModifiedByContactID",
                table: "SpecificationAttributeMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_OrderFlag",
                table: "SpecificationAttributeMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_ShowInList",
                table: "SpecificationAttributeMasters",
                column: "ShowInList");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_ShowInReport",
                table: "SpecificationAttributeMasters",
                column: "ShowInReport");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_StatusFlag",
                table: "SpecificationAttributeMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_TypeFlag",
                table: "SpecificationAttributeMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_UID",
                table: "SpecificationAttributeMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_AttributeKey",
                table: "SpecificationAttributes",
                column: "AttributeKey");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_Created",
                table: "SpecificationAttributes",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_CreatedByContactID",
                table: "SpecificationAttributes",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_IsDeleted",
                table: "SpecificationAttributes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_Modified",
                table: "SpecificationAttributes",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_ModifiedByContactID",
                table: "SpecificationAttributes",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_OrderFlag",
                table: "SpecificationAttributes",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_SpecificationID",
                table: "SpecificationAttributes",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_StatusFlag",
                table: "SpecificationAttributes",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_TypeFlag",
                table: "SpecificationAttributes",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_UID",
                table: "SpecificationAttributes",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Category",
                table: "SpecificationLibraryEntities",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Code",
                table: "SpecificationLibraryEntities",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_CodeFlag",
                table: "SpecificationLibraryEntities",
                column: "CodeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Created",
                table: "SpecificationLibraryEntities",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_CreatedByContactID",
                table: "SpecificationLibraryEntities",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_IsDeleted",
                table: "SpecificationLibraryEntities",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Modified",
                table: "SpecificationLibraryEntities",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_ModifiedByContactID",
                table: "SpecificationLibraryEntities",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_OrderFlag",
                table: "SpecificationLibraryEntities",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_StatusFlag",
                table: "SpecificationLibraryEntities",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Subtitle",
                table: "SpecificationLibraryEntities",
                column: "Subtitle");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Title",
                table: "SpecificationLibraryEntities",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_TypeFlag",
                table: "SpecificationLibraryEntities",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_UID",
                table: "SpecificationLibraryEntities",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_Created",
                table: "SpecificationLibraryEntityAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_CreatedByContactID",
                table: "SpecificationLibraryEntityAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_Filename",
                table: "SpecificationLibraryEntityAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_IsDeleted",
                table: "SpecificationLibraryEntityAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_Modified",
                table: "SpecificationLibraryEntityAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_ModifiedByContactID",
                table: "SpecificationLibraryEntityAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_OrderFlag",
                table: "SpecificationLibraryEntityAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_SpecificationLibraryEntityID",
                table: "SpecificationLibraryEntityAttachments",
                column: "SpecificationLibraryEntityID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_StatusFlag",
                table: "SpecificationLibraryEntityAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_TypeFlag",
                table: "SpecificationLibraryEntityAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_UID",
                table: "SpecificationLibraryEntityAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_AttributeKey",
                table: "SpecificationLibraryEntityAttributes",
                column: "AttributeKey");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_Created",
                table: "SpecificationLibraryEntityAttributes",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_CreatedByContactID",
                table: "SpecificationLibraryEntityAttributes",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_IsDeleted",
                table: "SpecificationLibraryEntityAttributes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_Modified",
                table: "SpecificationLibraryEntityAttributes",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_ModifiedByContactID",
                table: "SpecificationLibraryEntityAttributes",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_OrderFlag",
                table: "SpecificationLibraryEntityAttributes",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_SpecificationLibraryEntityID",
                table: "SpecificationLibraryEntityAttributes",
                column: "SpecificationLibraryEntityID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_StatusFlag",
                table: "SpecificationLibraryEntityAttributes",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_TypeFlag",
                table: "SpecificationLibraryEntityAttributes",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_UID",
                table: "SpecificationLibraryEntityAttributes",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_Created",
                table: "SpecificationLinearSegments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_CreatedByContactID",
                table: "SpecificationLinearSegments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_IsDeleted",
                table: "SpecificationLinearSegments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_Modified",
                table: "SpecificationLinearSegments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_ModifiedByContactID",
                table: "SpecificationLinearSegments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_OrderFlag",
                table: "SpecificationLinearSegments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_SpecificationID",
                table: "SpecificationLinearSegments",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_StatusFlag",
                table: "SpecificationLinearSegments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_Title",
                table: "SpecificationLinearSegments",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_TypeFlag",
                table: "SpecificationLinearSegments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_UID",
                table: "SpecificationLinearSegments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_Created",
                table: "Specifications",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_CreatedByContactID",
                table: "Specifications",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_IsDeleted",
                table: "Specifications",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_IsReadOnly",
                table: "Specifications",
                column: "IsReadOnly");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_Modified",
                table: "Specifications",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ModifiedByContactID",
                table: "Specifications",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_OrderFlag",
                table: "Specifications",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ParentID",
                table: "Specifications",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ProjectID",
                table: "Specifications",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ReferenceTag",
                table: "Specifications",
                column: "ReferenceTag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_RevisionNumber",
                table: "Specifications",
                column: "RevisionNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_SpecificationAreaID",
                table: "Specifications",
                column: "SpecificationAreaID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_StatusFlag",
                table: "Specifications",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_TypeFlag",
                table: "Specifications",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_UID",
                table: "Specifications",
                column: "UID");
        }
    }
}
