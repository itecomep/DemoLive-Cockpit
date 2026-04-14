using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class VM067 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Leaves",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Start = table.Column<DateTime>(type: "datetime2", nullable: false),
                    End = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AllDay = table.Column<bool>(type: "bit", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_Leaves", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Leaves_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_ContactID",
                table: "Leaves",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_Created",
                table: "Leaves",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_CreatedByContactID",
                table: "Leaves",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_IsDeleted",
                table: "Leaves",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_Modified",
                table: "Leaves",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_ModifiedByContactID",
                table: "Leaves",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_OrderFlag",
                table: "Leaves",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_StatusFlag",
                table: "Leaves",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_TypeFlag",
                table: "Leaves",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Leaves_UID",
                table: "Leaves",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Leaves");
        }
    }
}
