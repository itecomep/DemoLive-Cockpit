using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM087 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WorkOrderStages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkOrderID = table.Column<int>(type: "int", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Abbreviation = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    IsLumpsum = table.Column<bool>(type: "bit", nullable: false),
                    Revisions = table.Column<int>(type: "int", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BillingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PaymentReceivedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_WorkOrderStages", x => x.ID);
                    table.ForeignKey(
                        name: "FK_WorkOrderStages_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_WorkOrderStages_WorkOrderStages_ParentID",
                        column: x => x.ParentID,
                        principalTable: "WorkOrderStages",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_WorkOrderStages_WorkOrders_WorkOrderID",
                        column: x => x.WorkOrderID,
                        principalTable: "WorkOrders",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_Abbreviation",
                table: "WorkOrderStages",
                column: "Abbreviation");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_BillingDate",
                table: "WorkOrderStages",
                column: "BillingDate");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_Created",
                table: "WorkOrderStages",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_CreatedByContactID",
                table: "WorkOrderStages",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_DueDate",
                table: "WorkOrderStages",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_IsDeleted",
                table: "WorkOrderStages",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_IsLumpsum",
                table: "WorkOrderStages",
                column: "IsLumpsum");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_Modified",
                table: "WorkOrderStages",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_ModifiedByContactID",
                table: "WorkOrderStages",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_OrderFlag",
                table: "WorkOrderStages",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_ParentID",
                table: "WorkOrderStages",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_PaymentReceivedDate",
                table: "WorkOrderStages",
                column: "PaymentReceivedDate");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_Percentage",
                table: "WorkOrderStages",
                column: "Percentage");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_ProjectID",
                table: "WorkOrderStages",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_StatusFlag",
                table: "WorkOrderStages",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_Title",
                table: "WorkOrderStages",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_TypeFlag",
                table: "WorkOrderStages",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_UID",
                table: "WorkOrderStages",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrderStages_WorkOrderID",
                table: "WorkOrderStages",
                column: "WorkOrderID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkOrderStages");
        }
    }
}
