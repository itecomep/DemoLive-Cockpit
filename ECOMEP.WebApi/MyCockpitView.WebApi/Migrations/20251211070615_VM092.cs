using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM092 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "_searchTags",
                table: "UserPermissionGroupMaps");

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "UserPermissionGroupMaps",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()",
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "UserPermissionGroupMaps",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "UserPermissionGroupMaps",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "UserPermissionGroupMaps",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "UserPermissionGroupMaps",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "UserPermissionGroupMaps",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "UserPermissionGroupMaps",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "UserPermissionGroupMaps",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorkOrderID",
                table: "ProjectBills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_Created",
                table: "UserPermissionGroupMaps",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_CreatedByContactID",
                table: "UserPermissionGroupMaps",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_IsDeleted",
                table: "UserPermissionGroupMaps",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_IsVersion",
                table: "UserPermissionGroupMaps",
                column: "IsVersion");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_Modified",
                table: "UserPermissionGroupMaps",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_ModifiedByContactID",
                table: "UserPermissionGroupMaps",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_OrderFlag",
                table: "UserPermissionGroupMaps",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_PermissionGroupID",
                table: "UserPermissionGroupMaps",
                column: "PermissionGroupID");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_StatusFlag",
                table: "UserPermissionGroupMaps",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_TypeFlag",
                table: "UserPermissionGroupMaps",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_UID",
                table: "UserPermissionGroupMaps",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionGroupMaps_UserID",
                table: "UserPermissionGroupMaps",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_Created",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_CreatedByContactID",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_IsDeleted",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_IsVersion",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_Modified",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_ModifiedByContactID",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_OrderFlag",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_PermissionGroupID",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_StatusFlag",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_TypeFlag",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_UID",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionGroupMaps_UserID",
                table: "UserPermissionGroupMaps");

            migrationBuilder.DropColumn(
                name: "WorkOrderID",
                table: "ProjectBills");

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "UserPermissionGroupMaps",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldDefaultValueSql: "NEWID()");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "UserPermissionGroupMaps",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "UserPermissionGroupMaps",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "UserPermissionGroupMaps",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "UserPermissionGroupMaps",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "UserPermissionGroupMaps",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "UserPermissionGroupMaps",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "UserPermissionGroupMaps",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "_searchTags",
                table: "UserPermissionGroupMaps",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
