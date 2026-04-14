using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM065 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_GroupCompanyContactID",
                table: "Projects");

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderServiceAmounts",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectWorkOrderID = table.Column<int>(type: "int", nullable: false),
                    Service = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectWorkOrderServiceAmounts", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderServiceAmounts_ProjectWorkOrders_ProjectWorkOrderID",
                        column: x => x.ProjectWorkOrderID,
                        principalTable: "ProjectWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_Created",
                table: "ProjectWorkOrderServiceAmounts",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_CreatedByContactID",
                table: "ProjectWorkOrderServiceAmounts",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_IsDeleted",
                table: "ProjectWorkOrderServiceAmounts",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_Modified",
                table: "ProjectWorkOrderServiceAmounts",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_ModifiedByContactID",
                table: "ProjectWorkOrderServiceAmounts",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_OrderFlag",
                table: "ProjectWorkOrderServiceAmounts",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_ProjectWorkOrderID",
                table: "ProjectWorkOrderServiceAmounts",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_StatusFlag",
                table: "ProjectWorkOrderServiceAmounts",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_TypeFlag",
                table: "ProjectWorkOrderServiceAmounts",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderServiceAmounts_UID",
                table: "ProjectWorkOrderServiceAmounts",
                column: "UID");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_GroupCompanyContactID",
                table: "Projects",
                column: "GroupCompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_GroupCompanyContactID",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderServiceAmounts");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_GroupCompanyContactID",
                table: "Projects",
                column: "GroupCompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }
    }
}
