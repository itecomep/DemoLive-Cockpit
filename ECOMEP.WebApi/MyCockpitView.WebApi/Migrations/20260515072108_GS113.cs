using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class GS113 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectStageMails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StageId = table.Column<int>(type: "int", nullable: false),
                    StageName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StageCompleteRevision = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GenerateInvoiceRevision = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReworkRevision = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StageComplete = table.Column<bool>(type: "bit", nullable: false),
                    GenerateInvoice = table.Column<bool>(type: "bit", nullable: false),
                    Rework = table.Column<bool>(type: "bit", nullable: false),
                    ToMail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CcMail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BccMail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MailSentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GmailMessageId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GmailThreadId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectStageMails", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectStageMails");
        }
    }
}
