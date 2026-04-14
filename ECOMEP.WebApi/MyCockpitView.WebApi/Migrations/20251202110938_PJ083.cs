using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class PJ083 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PermissionGroups",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RoleCodes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    ParentVersionID = table.Column<int>(type: "int", nullable: true),
                    IsVersion = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false),
                    _searchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PermissionGroups", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "UserPermissionGroupMaps",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    PermissionGroupID = table.Column<int>(type: "int", nullable: false),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    ParentVersionID = table.Column<int>(type: "int", nullable: true),
                    IsVersion = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false),
                    _searchTags = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPermissionGroupMaps", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PermissionGroups");

            migrationBuilder.DropTable(
                name: "UserPermissionGroupMaps");
        }
    }
}
