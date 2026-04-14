using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK012 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Share = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    WorkOrderNo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WorkOrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WorkDetail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WorkProposalTemplate = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    InteriorCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BlobUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
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
                name: "ProjectWorkOrderAttachments",
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
                    table.PrimaryKey("PK_ProjectWorkOrderAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderAttachments_ProjectWorkOrders_ProjectWorkOrderID",
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
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                name: "IX_ProjectWorkOrderAreas_Area",
                table: "ProjectWorkOrderAreas",
                column: "Area");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_AreaTitle",
                table: "ProjectWorkOrderAreas",
                column: "AreaTitle");

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
                name: "IX_ProjectWorkOrderAttachments_Created",
                table: "ProjectWorkOrderAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_CreatedByContactID",
                table: "ProjectWorkOrderAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_Filename",
                table: "ProjectWorkOrderAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_IsDeleted",
                table: "ProjectWorkOrderAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_Modified",
                table: "ProjectWorkOrderAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_ModifiedByContactID",
                table: "ProjectWorkOrderAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_OrderFlag",
                table: "ProjectWorkOrderAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_ProjectWorkOrderID",
                table: "ProjectWorkOrderAttachments",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_StatusFlag",
                table: "ProjectWorkOrderAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_TypeFlag",
                table: "ProjectWorkOrderAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_UID",
                table: "ProjectWorkOrderAttachments",
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
                name: "IX_ProjectWorkOrderMasters_Template",
                table: "ProjectWorkOrderMasters",
                column: "Template");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_TypeFlag",
                table: "ProjectWorkOrderMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_UID",
                table: "ProjectWorkOrderMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_Area",
                table: "ProjectWorkOrders",
                column: "Area");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_AreaTitle",
                table: "ProjectWorkOrders",
                column: "AreaTitle");

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
                name: "IX_ProjectWorkOrders_WorkOrderDate",
                table: "ProjectWorkOrders",
                column: "WorkOrderDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_WorkOrderNo",
                table: "ProjectWorkOrders",
                column: "WorkOrderNo");

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
                name: "IX_ProjectWorkOrderSegmentMasters_Title",
                table: "ProjectWorkOrderSegmentMasters",
                column: "Title");

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
                name: "IX_ProjectWorkOrderSegments_Title",
                table: "ProjectWorkOrderSegments",
                column: "Title");

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
                name: "ProjectWorkOrderAttachments");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderSegmentMasters");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderSegments");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderMasters");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrders");
        }
    }
}
