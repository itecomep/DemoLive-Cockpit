using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM051 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Revision",
                table: "RequestTickets",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "StageID",
                table: "RequestTickets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StageTitle",
                table: "RequestTickets",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "ProjectWorkOrders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AssistantProjectManagerContactID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GroupContactID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectManagerContactID",
                table: "Projects",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Revision",
                table: "RequestTickets",
                column: "Revision");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_StageID",
                table: "RequestTickets",
                column: "StageID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_StageTitle",
                table: "RequestTickets",
                column: "StageTitle");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_AssistantProjectManagerContactID",
                table: "Projects",
                column: "AssistantProjectManagerContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_GroupContactID",
                table: "Projects",
                column: "GroupContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectManagerContactID",
                table: "Projects",
                column: "ProjectManagerContactID");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_AssistantProjectManagerContactID",
                table: "Projects",
                column: "AssistantProjectManagerContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_GroupContactID",
                table: "Projects",
                column: "GroupContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ProjectManagerContactID",
                table: "Projects",
                column: "ProjectManagerContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_AssistantProjectManagerContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_GroupContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ProjectManagerContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_RequestTickets_Revision",
                table: "RequestTickets");

            migrationBuilder.DropIndex(
                name: "IX_RequestTickets_StageID",
                table: "RequestTickets");

            migrationBuilder.DropIndex(
                name: "IX_RequestTickets_StageTitle",
                table: "RequestTickets");

            migrationBuilder.DropIndex(
                name: "IX_Projects_AssistantProjectManagerContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_GroupContactID",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ProjectManagerContactID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Revision",
                table: "RequestTickets");

            migrationBuilder.DropColumn(
                name: "StageID",
                table: "RequestTickets");

            migrationBuilder.DropColumn(
                name: "StageTitle",
                table: "RequestTickets");

            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "ProjectWorkOrders");

            migrationBuilder.DropColumn(
                name: "AssistantProjectManagerContactID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "GroupContactID",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ProjectManagerContactID",
                table: "Projects");
        }
    }
}
