using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM080 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkOrderMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypologyTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_WorkOrderMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "WorkOrders",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    Typology = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WorkOrderNo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WorkOrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Area = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    IsLumpSum = table.Column<bool>(type: "bit", nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Amount = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_WorkOrders", x => x.ID);
                    table.ForeignKey(
                        name: "FK_WorkOrders_Companies_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Companies",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_WorkOrders_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkOrderMasterStages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkOrderMasterID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Value = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_WorkOrderMasterStages", x => x.ID);
                    table.ForeignKey(
                        name: "FK_WorkOrderMasterStages_WorkOrderMasters_WorkOrderMasterID",
                        column: x => x.WorkOrderMasterID,
                        principalTable: "WorkOrderMasters",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkOrderAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkOrderID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_WorkOrderAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_WorkOrderAttachments_WorkOrders_WorkOrderID",
                        column: x => x.WorkOrderID,
                        principalTable: "WorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_Created",
                table: "WorkOrderAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_CreatedByContactID",
                table: "WorkOrderAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_Filename",
                table: "WorkOrderAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_IsDeleted",
                table: "WorkOrderAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_Modified",
                table: "WorkOrderAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_ModifiedByContactID",
                table: "WorkOrderAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_OrderFlag",
                table: "WorkOrderAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_StatusFlag",
                table: "WorkOrderAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_TypeFlag",
                table: "WorkOrderAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_UID",
                table: "WorkOrderAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderAttachments_WorkOrderID",
                table: "WorkOrderAttachments",
                column: "WorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_Created",
                table: "WorkOrderMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_CreatedByContactID",
                table: "WorkOrderMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_IsDeleted",
                table: "WorkOrderMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_Modified",
                table: "WorkOrderMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_ModifiedByContactID",
                table: "WorkOrderMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_OrderFlag",
                table: "WorkOrderMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_StatusFlag",
                table: "WorkOrderMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_TypeFlag",
                table: "WorkOrderMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasters_UID",
                table: "WorkOrderMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_Created",
                table: "WorkOrderMasterStages",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_CreatedByContactID",
                table: "WorkOrderMasterStages",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_IsDeleted",
                table: "WorkOrderMasterStages",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_Modified",
                table: "WorkOrderMasterStages",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_ModifiedByContactID",
                table: "WorkOrderMasterStages",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_OrderFlag",
                table: "WorkOrderMasterStages",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_StatusFlag",
                table: "WorkOrderMasterStages",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_TypeFlag",
                table: "WorkOrderMasterStages",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_UID",
                table: "WorkOrderMasterStages",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderMasterStages_WorkOrderMasterID",
                table: "WorkOrderMasterStages",
                column: "WorkOrderMasterID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_CompanyID",
                table: "WorkOrders",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_Created",
                table: "WorkOrders",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_CreatedByContactID",
                table: "WorkOrders",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_IsDeleted",
                table: "WorkOrders",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_Modified",
                table: "WorkOrders",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_ModifiedByContactID",
                table: "WorkOrders",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_OrderFlag",
                table: "WorkOrders",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_ProjectID",
                table: "WorkOrders",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_StatusFlag",
                table: "WorkOrders",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_TypeFlag",
                table: "WorkOrders",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_UID",
                table: "WorkOrders",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkOrderAttachments");

            migrationBuilder.DropTable(
                name: "WorkOrderMasterStages");

            migrationBuilder.DropTable(
                name: "WorkOrders");

            migrationBuilder.DropTable(
                name: "WorkOrderMasters");
        }
    }
}
