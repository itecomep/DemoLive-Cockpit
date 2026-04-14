using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM069 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "_searchTags",
                table: "HolidayMasters");

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "HolidayMasters",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()",
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "HolidayMasters",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "HolidayMasters",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "HolidayMasters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "HolidayMasters",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "HolidayMasters",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "HolidayMasters",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "HolidayMasters",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_Created",
                table: "HolidayMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_CreatedByContactID",
                table: "HolidayMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_IsDeleted",
                table: "HolidayMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_Modified",
                table: "HolidayMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_ModifiedByContactID",
                table: "HolidayMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_OrderFlag",
                table: "HolidayMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_StatusFlag",
                table: "HolidayMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_TypeFlag",
                table: "HolidayMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_HolidayMasters_UID",
                table: "HolidayMasters",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_Created",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_CreatedByContactID",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_IsDeleted",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_Modified",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_ModifiedByContactID",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_OrderFlag",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_StatusFlag",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_TypeFlag",
                table: "HolidayMasters");

            migrationBuilder.DropIndex(
                name: "IX_HolidayMasters_UID",
                table: "HolidayMasters");

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "HolidayMasters",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldDefaultValueSql: "NEWID()");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "HolidayMasters",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "HolidayMasters",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "HolidayMasters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "HolidayMasters",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "HolidayMasters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "HolidayMasters",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "HolidayMasters",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "_searchTags",
                table: "HolidayMasters",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
