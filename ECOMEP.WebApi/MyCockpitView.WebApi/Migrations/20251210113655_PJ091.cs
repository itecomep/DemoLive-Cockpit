using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class PJ091 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "_searchTags",
                table: "PermissionGroups");

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "PermissionGroups",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()",
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "PermissionGroups",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "PermissionGroups",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "PermissionGroups",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "RoleCodes",
                table: "PermissionGroups",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "PermissionGroups",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "PermissionGroups",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "PermissionGroups",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "PermissionGroups",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_Created",
                table: "PermissionGroups",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_CreatedByContactID",
                table: "PermissionGroups",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_IsDeleted",
                table: "PermissionGroups",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_Modified",
                table: "PermissionGroups",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_ModifiedByContactID",
                table: "PermissionGroups",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_OrderFlag",
                table: "PermissionGroups",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_StatusFlag",
                table: "PermissionGroups",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_TypeFlag",
                table: "PermissionGroups",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionGroups_UID",
                table: "PermissionGroups",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_Created",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_CreatedByContactID",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_IsDeleted",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_Modified",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_ModifiedByContactID",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_OrderFlag",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_StatusFlag",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_TypeFlag",
                table: "PermissionGroups");

            migrationBuilder.DropIndex(
                name: "IX_PermissionGroups_UID",
                table: "PermissionGroups");

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "PermissionGroups",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldDefaultValueSql: "NEWID()");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "PermissionGroups",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "PermissionGroups",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "PermissionGroups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RoleCodes",
                table: "PermissionGroups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "PermissionGroups",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "PermissionGroups",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "PermissionGroups",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "PermissionGroups",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "_searchTags",
                table: "PermissionGroups",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
