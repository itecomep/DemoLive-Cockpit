using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK022 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactTeamMember_ContactTeams_ContactTeamID",
                table: "ContactTeamMember");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactTeamMember_Contacts_ContactID",
                table: "ContactTeamMember");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContactTeamMember",
                table: "ContactTeamMember");

            migrationBuilder.DropColumn(
                name: "_searchTags",
                table: "ContactTeamMember");

            migrationBuilder.RenameTable(
                name: "ContactTeamMember",
                newName: "ContactTeamMembers");

            migrationBuilder.RenameIndex(
                name: "IX_ContactTeamMember_ContactTeamID",
                table: "ContactTeamMembers",
                newName: "IX_ContactTeamMembers_ContactTeamID");

            migrationBuilder.RenameIndex(
                name: "IX_ContactTeamMember_ContactID",
                table: "ContactTeamMembers",
                newName: "IX_ContactTeamMembers_ContactID");

            migrationBuilder.AddColumn<int>(
                name: "AssisstantID",
                table: "ContactTeams",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LeaderID",
                table: "ContactTeams",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "ContactTeamMembers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()",
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "ContactTeamMembers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "ContactTeamMembers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "ContactTeamMembers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "ContactTeamMembers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "ContactTeamMembers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "ContactTeamMembers",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "ContactTeamMembers",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContactTeamMembers",
                table: "ContactTeamMembers",
                column: "ID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_Created",
                table: "ContactTeamMembers",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_CreatedByContactID",
                table: "ContactTeamMembers",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_IsAssistantLeader",
                table: "ContactTeamMembers",
                column: "IsAssistantLeader");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_IsDeleted",
                table: "ContactTeamMembers",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_IsLeader",
                table: "ContactTeamMembers",
                column: "IsLeader");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_Modified",
                table: "ContactTeamMembers",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_ModifiedByContactID",
                table: "ContactTeamMembers",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_OrderFlag",
                table: "ContactTeamMembers",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_StatusFlag",
                table: "ContactTeamMembers",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_TypeFlag",
                table: "ContactTeamMembers",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactTeamMembers_UID",
                table: "ContactTeamMembers",
                column: "UID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactTeamMembers_ContactTeams_ContactTeamID",
                table: "ContactTeamMembers",
                column: "ContactTeamID",
                principalTable: "ContactTeams",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactTeamMembers_Contacts_ContactID",
                table: "ContactTeamMembers",
                column: "ContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactTeamMembers_ContactTeams_ContactTeamID",
                table: "ContactTeamMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactTeamMembers_Contacts_ContactID",
                table: "ContactTeamMembers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContactTeamMembers",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_Created",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_CreatedByContactID",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_IsAssistantLeader",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_IsDeleted",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_IsLeader",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_Modified",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_ModifiedByContactID",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_OrderFlag",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_StatusFlag",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_TypeFlag",
                table: "ContactTeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_ContactTeamMembers_UID",
                table: "ContactTeamMembers");

            migrationBuilder.DropColumn(
                name: "AssisstantID",
                table: "ContactTeams");

            migrationBuilder.DropColumn(
                name: "LeaderID",
                table: "ContactTeams");

            migrationBuilder.RenameTable(
                name: "ContactTeamMembers",
                newName: "ContactTeamMember");

            migrationBuilder.RenameIndex(
                name: "IX_ContactTeamMembers_ContactTeamID",
                table: "ContactTeamMember",
                newName: "IX_ContactTeamMember_ContactTeamID");

            migrationBuilder.RenameIndex(
                name: "IX_ContactTeamMembers_ContactID",
                table: "ContactTeamMember",
                newName: "IX_ContactTeamMember_ContactID");

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "ContactTeamMember",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldDefaultValueSql: "NEWID()");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "ContactTeamMember",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "ContactTeamMember",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "SearchTags",
                table: "ContactTeamMember",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "ContactTeamMember",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "ContactTeamMember",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "ContactTeamMember",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "ContactTeamMember",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "_searchTags",
                table: "ContactTeamMember",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContactTeamMember",
                table: "ContactTeamMember",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactTeamMember_ContactTeams_ContactTeamID",
                table: "ContactTeamMember",
                column: "ContactTeamID",
                principalTable: "ContactTeams",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactTeamMember_Contacts_ContactID",
                table: "ContactTeamMember",
                column: "ContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
