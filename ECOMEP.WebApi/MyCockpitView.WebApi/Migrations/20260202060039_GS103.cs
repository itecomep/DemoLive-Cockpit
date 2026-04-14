using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    public partial class GS103 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF OBJECT_ID('dbo.AspNetRoles', 'U') IS NOT NULL
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1
                        FROM dbo.AspNetRoles
                        WHERE NormalizedName = 'PROJECT_GMAIL_VIEW'
                    )
                    BEGIN
                        INSERT INTO dbo.AspNetRoles
                        (Id, Module, Title, Description, IsSpecial, IsHidden, IsDefault, Name, NormalizedName, ConcurrencyStamp, [Group], OrderFlag)
                        VALUES
                        (NEWID(), 'Email', 'Gmail Tab', 'Permission to view Gmail',
                         0, 0, 0,
                         'PROJECT_GMAIL_VIEW', 'PROJECT_GMAIL_VIEW',
                         NULL, 'EMAIL', 0)
                    END
                END
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF OBJECT_ID('dbo.AspNetRoles', 'U') IS NOT NULL
                BEGIN
                    DELETE FROM dbo.AspNetRoles
                    WHERE NormalizedName = 'PROJECT_GMAIL_VIEW'
                END
            ");
        }
    }
}
