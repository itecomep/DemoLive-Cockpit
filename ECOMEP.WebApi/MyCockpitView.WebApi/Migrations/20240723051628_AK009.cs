using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK009 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_Contacts_RelationshipManagerID",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "EmployeeCount",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Grade",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Initials",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "IsOwned",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "VHrRate",
                table: "Contacts");

            migrationBuilder.RenameColumn(
                name: "RelationshipManagerID",
                table: "Contacts",
                newName: "ParentID");

            migrationBuilder.RenameIndex(
                name: "IX_Contacts_RelationshipManagerID",
                table: "Contacts",
                newName: "IX_Contacts_ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Anniversary",
                table: "Contacts",
                column: "Anniversary");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Birth",
                table: "Contacts",
                column: "Birth");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Gender",
                table: "Contacts",
                column: "Gender");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_IsCompany",
                table: "Contacts",
                column: "IsCompany");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_LastName",
                table: "Contacts",
                column: "LastName");

            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_Contacts_ParentID",
                table: "Contacts",
                column: "ParentID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_Contacts_ParentID",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_Anniversary",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_Birth",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_Gender",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_IsCompany",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_LastName",
                table: "Contacts");

            migrationBuilder.RenameColumn(
                name: "ParentID",
                table: "Contacts",
                newName: "RelationshipManagerID");

            migrationBuilder.RenameIndex(
                name: "IX_Contacts_ParentID",
                table: "Contacts",
                newName: "IX_Contacts_RelationshipManagerID");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeCount",
                table: "Contacts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Grade",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Initials",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOwned",
                table: "Contacts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "VHrRate",
                table: "Contacts",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_Contacts_RelationshipManagerID",
                table: "Contacts",
                column: "RelationshipManagerID",
                principalTable: "Contacts",
                principalColumn: "ID");
        }
    }
}
