using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK013 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParentID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProjectStageMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicableFromDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApplicableTillDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StageTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    StageValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Typology = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
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
                    table.PrimaryKey("PK_ProjectStageMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ProjectStages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    StageTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    StageValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsLumpsum = table.Column<bool>(type: "bit", nullable: false),
                    Revisions = table.Column<int>(type: "int", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_ProjectStages", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectStages_ProjectStages_ParentID",
                        column: x => x.ParentID,
                        principalTable: "ProjectStages",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ProjectStages_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ParentID",
                table: "Projects",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_ApplicableFromDate",
                table: "ProjectStageMasters",
                column: "ApplicableFromDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_ApplicableTillDate",
                table: "ProjectStageMasters",
                column: "ApplicableTillDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_Created",
                table: "ProjectStageMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_CreatedByContactID",
                table: "ProjectStageMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_IsDeleted",
                table: "ProjectStageMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_Modified",
                table: "ProjectStageMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_ModifiedByContactID",
                table: "ProjectStageMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_OrderFlag",
                table: "ProjectStageMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_StageTitle",
                table: "ProjectStageMasters",
                column: "StageTitle");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_StageValue",
                table: "ProjectStageMasters",
                column: "StageValue");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_StatusFlag",
                table: "ProjectStageMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_TypeFlag",
                table: "ProjectStageMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_Typology",
                table: "ProjectStageMasters",
                column: "Typology");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_UID",
                table: "ProjectStageMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_Created",
                table: "ProjectStages",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_CreatedByContactID",
                table: "ProjectStages",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_DueDate",
                table: "ProjectStages",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_IsDeleted",
                table: "ProjectStages",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_IsLumpsum",
                table: "ProjectStages",
                column: "IsLumpsum");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_Modified",
                table: "ProjectStages",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_ModifiedByContactID",
                table: "ProjectStages",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_OrderFlag",
                table: "ProjectStages",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_ParentID",
                table: "ProjectStages",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_ProjectID",
                table: "ProjectStages",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_StageTitle",
                table: "ProjectStages",
                column: "StageTitle");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_StageValue",
                table: "ProjectStages",
                column: "StageValue");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_StatusFlag",
                table: "ProjectStages",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_TypeFlag",
                table: "ProjectStages",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_UID",
                table: "ProjectStages",
                column: "UID");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Projects_ParentID",
                table: "Projects",
                column: "ParentID",
                principalTable: "Projects",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Projects_ParentID",
                table: "Projects");

            migrationBuilder.DropTable(
                name: "ProjectStageMasters");

            migrationBuilder.DropTable(
                name: "ProjectStages");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ParentID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ParentID",
                table: "Projects");
        }
    }
}
