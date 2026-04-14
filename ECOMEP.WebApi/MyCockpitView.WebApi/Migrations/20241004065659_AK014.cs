using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK014 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactAssociations_Contacts_CompanyContactID",
                table: "ContactAssociations");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactAssociations_Contacts_PersonContactID",
                table: "ContactAssociations");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_AspNetUsers_UserID",
                table: "RefreshTokens");

            migrationBuilder.DropForeignKey(
                name: "FK_WFTasks_Contacts_AssignerContactID",
                table: "WFTasks");

          

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderAreas");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderAttachments");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderSegmentMasters");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderSegments");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrderMasters");

            migrationBuilder.DropTable(
                name: "ProjectWorkOrders");

            migrationBuilder.DropIndex(
                name: "IX_RefreshTokens_UserID",
                table: "RefreshTokens");

            migrationBuilder.DropIndex(
                name: "IX_ProjectStages_StageValue",
                table: "ProjectStages");

            migrationBuilder.DropIndex(
                name: "IX_ProjectStageMasters_ApplicableFromDate",
                table: "ProjectStageMasters");

            migrationBuilder.DropIndex(
                name: "IX_ProjectStageMasters_ApplicableTillDate",
                table: "ProjectStageMasters");

            migrationBuilder.DropIndex(
                name: "IX_Projects_City",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ContractCompletionDate",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ExpectedCompletionDate",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_InquiryConvertionDate",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_PinCode",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_State",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_Anniversary",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_Birth",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_FirstName",
                table: "Contacts");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_FullName",
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

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_Filename",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "StageValue",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "ApplicableFromDate",
                table: "ProjectStageMasters");

            migrationBuilder.DropColumn(
                name: "ApplicableTillDate",
                table: "ProjectStageMasters");

            migrationBuilder.DropColumn(
                name: "GSTStateCode",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ContactID",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "StageTitle",
                table: "ProjectStages",
                newName: "Title");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectStages_StageTitle",
                table: "ProjectStages",
                newName: "IX_ProjectStages_Title");

            migrationBuilder.RenameColumn(
                name: "StageValue",
                table: "ProjectStageMasters",
                newName: "Percentage");

            migrationBuilder.RenameColumn(
                name: "StageTitle",
                table: "ProjectStageMasters",
                newName: "Title");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectStageMasters_StageValue",
                table: "ProjectStageMasters",
                newName: "IX_ProjectStageMasters_Percentage");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectStageMasters_StageTitle",
                table: "ProjectStageMasters",
                newName: "IX_ProjectStageMasters_Title");

            migrationBuilder.RenameColumn(
                name: "_searchTags",
                table: "ContactAppointmentAttachments",
                newName: "SearchTags");

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrRate",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrConsumedCost",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrConsumed",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssignedCost",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssigned",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssessedCost",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssessed",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "WFTasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Subtitle",
                table: "WFTasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "ManValue",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrConsumed",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssigned",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssessed",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Entity",
                table: "WFTasks",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "AssessmentPoints",
                table: "WFTasks",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Subtitle",
                table: "RequestTickets",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<bool>(
                name: "IsRepeatRequired",
                table: "RequestTickets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Abbreviation",
                table: "ProjectStages",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Percentage",
                table: "ProjectStages",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PinCode",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "LandscapeArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "InteriorArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "FacadeArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedMHr",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "Projects",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BillingTitle",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StateCode",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Contacts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Contacts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DrivingLicenseNo",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoFilename",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Urls",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "_addresses",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "_emails",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "_phones",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.Sql("UPDATE Contacts\r\nSET _addresses = (\r\n    SELECT \r\n    CA.Title,\r\n        CA.Street,\r\n        CA.City,\r\n        CA.State,\r\n        CA.Pincode,\r\n        CA.Country,\r\n        CA.IsPrimary\r\n    FROM ContactAddresses CA\r\n    WHERE CA.ContactId = Contacts.Id\r\n    FOR JSON PATH\r\n);\r\n\r\nUPDATE Contacts\r\nSET _phones = (\r\n    SELECT \r\n    CA.Title,\r\n        CA.Phone,\r\n        CA.IsPrimary\r\n    FROM ContactPhones CA\r\n    WHERE CA.ContactId = Contacts.Id\r\n    FOR JSON PATH\r\n);\r\n\r\nUPDATE Contacts\r\nSET _emails = (\r\n    SELECT \r\n    CA.Title,\r\n        CA.Email,\r\n        CA.IsPrimary\r\n    FROM ContactEmails CA\r\n    WHERE CA.ContactId = Contacts.Id\r\n    FOR JSON PATH\r\n);");

            migrationBuilder.DropTable(
              name: "ContactAddresses");

            migrationBuilder.DropTable(
                name: "ContactEmails");

            migrationBuilder.DropTable(
                name: "ContactNotes");

            migrationBuilder.DropTable(
                name: "ContactPhones");

            migrationBuilder.AlterColumn<decimal>(
                name: "ManValue",
                table: "ContactAppointments",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedVhr",
                table: "ContactAppointments",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedRemuneration",
                table: "ContactAppointments",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AddColumn<string>(
                name: "BankAccountNo",
                table: "ContactAppointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "ContactAppointmentAttachments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()",
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "ContactAppointmentAttachments",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<string>(
                name: "Filename",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Points",
                table: "AssessmentMasters",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.CreateTable(
                name: "ImageLibraryEntities",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageLibraryEntities", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Packages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    ProjectStageID = table.Column<int>(type: "int", nullable: true),
                    ProjectAreaID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SubmissionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MHrAssigned = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    MHrConsumed = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
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
                    table.PrimaryKey("PK_Packages", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ProjectAreas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
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
                    table.PrimaryKey("PK_ProjectAreas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectAreas_ProjectAreas_ParentID",
                        column: x => x.ParentID,
                        principalTable: "ProjectAreas",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ProjectAreas_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectStageDeliveries",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Abbreviation = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ProjectStageID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectStageDeliveries", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectStageDeliveries_ProjectStages_ProjectStageID",
                        column: x => x.ProjectStageID,
                        principalTable: "ProjectStages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectStageMasterDeliveries",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectStageMasterID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Abbrivation = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_ProjectStageMasterDeliveries", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectStageMasterDeliveries_ProjectStageMasters_ProjectStageMasterID",
                        column: x => x.ProjectStageMasterID,
                        principalTable: "ProjectStageMasters",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAreas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    ProjectAreaID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_SpecificationAreas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAreas_SpecificationAreas_ParentID",
                        column: x => x.ParentID,
                        principalTable: "SpecificationAreas",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAttributeMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Group = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Attribute = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Input = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Min = table.Column<int>(type: "int", nullable: true),
                    Max = table.Column<int>(type: "int", nullable: true),
                    Options = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    ShowInList = table.Column<bool>(type: "bit", nullable: false),
                    ShowInReport = table.Column<bool>(type: "bit", nullable: false),
                    GroupHint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hint = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HideCondition = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_SpecificationAttributeMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLibraryEntities",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Subtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CodeFlag = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_SpecificationLibraryEntities", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "WebPushSubscriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    OS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Browser = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Device = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeviceType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Subscription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebPushSubscriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PackageAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PackageID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_PackageAttachments_Packages_PackageID",
                        column: x => x.PackageID,
                        principalTable: "Packages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackageContacts",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PackageID = table.Column<int>(type: "int", nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Company = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                    table.PrimaryKey("PK_PackageContacts", x => x.ID);
                    table.ForeignKey(
                        name: "FK_PackageContacts_Packages_PackageID",
                        column: x => x.PackageID,
                        principalTable: "Packages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackageStudioWorks",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssigneeContactID = table.Column<int>(type: "int", nullable: false),
                    AssignerContactID = table.Column<int>(type: "int", nullable: true),
                    MHrAssigned = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    MHrConsumed = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    PackageID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_PackageStudioWorks", x => x.ID);
                    table.ForeignKey(
                        name: "FK_PackageStudioWorks_Contacts_AssigneeContactID",
                        column: x => x.AssigneeContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PackageStudioWorks_Contacts_AssignerContactID",
                        column: x => x.AssignerContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PackageStudioWorks_Packages_PackageID",
                        column: x => x.PackageID,
                        principalTable: "Packages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectAreaStages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    ProjectAreaID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Abbreviation = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ProjectStageID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_ProjectAreaStages", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectAreaStages_ProjectAreas_ProjectAreaID",
                        column: x => x.ProjectAreaID,
                        principalTable: "ProjectAreas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAreaAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationAreaID = table.Column<int>(type: "int", nullable: false),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAreaAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAreaAttachments_SpecificationAreas_SpecificationAreaID",
                        column: x => x.SpecificationAreaID,
                        principalTable: "SpecificationAreas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Specifications",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    SpecificationMasterID = table.Column<int>(type: "int", nullable: true),
                    ReferenceTag = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    SymbolUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RevisionNumber = table.Column<int>(type: "int", nullable: false),
                    FixtureScheduleTime = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SpecificationAreaID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_Specifications", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Specifications_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Specifications_SpecificationAreas_SpecificationAreaID",
                        column: x => x.SpecificationAreaID,
                        principalTable: "SpecificationAreas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLibraryEntityAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationLibraryEntityID = table.Column<int>(type: "int", nullable: false),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationLibraryEntityAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationLibraryEntityAttachments_SpecificationLibraryEntities_SpecificationLibraryEntityID",
                        column: x => x.SpecificationLibraryEntityID,
                        principalTable: "SpecificationLibraryEntities",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLibraryEntityAttributes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationLibraryEntityID = table.Column<int>(type: "int", nullable: false),
                    AttributeKey = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Group = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    AttributeValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SpecificationAttributeMasterID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_SpecificationLibraryEntityAttributes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationLibraryEntityAttributes_SpecificationLibraryEntities_SpecificationLibraryEntityID",
                        column: x => x.SpecificationLibraryEntityID,
                        principalTable: "SpecificationLibraryEntities",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PackageStudioWorkAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PackageStudioWorkID = table.Column<int>(type: "int", nullable: false),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageStudioWorkAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_PackageStudioWorkAttachments_PackageStudioWorks_PackageStudioWorkID",
                        column: x => x.PackageStudioWorkID,
                        principalTable: "PackageStudioWorks",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectAreaStageDeliveries",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Abbreviation = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Percentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ProjectAreaStageID = table.Column<int>(type: "int", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    ProjectStageID = table.Column<int>(type: "int", nullable: true),
                    ProjectStageDeliveryID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_ProjectAreaStageDeliveries", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectAreaStageDeliveries_ProjectAreaStages_ProjectAreaStageID",
                        column: x => x.ProjectAreaStageID,
                        principalTable: "ProjectAreaStages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAccessories",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
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
                    table.PrimaryKey("PK_SpecificationAccessories", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAccessories_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
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
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpecificationAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAttachments_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationAttributes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
                    AttributeKey = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Group = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    AttributeValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SpecificationAttributeMasterID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_SpecificationAttributes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationAttributes_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SpecificationLinearSegments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecificationID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Increment = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SurfaceLength = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OptimumLength = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
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
                    table.PrimaryKey("PK_SpecificationLinearSegments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_SpecificationLinearSegments_Specifications_SpecificationID",
                        column: x => x.SpecificationID,
                        principalTable: "Specifications",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_Abbreviation",
                table: "ProjectStages",
                column: "Abbreviation");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_Percentage",
                table: "ProjectStages",
                column: "Percentage");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_Created",
                table: "ContactAppointmentAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_CreatedByContactID",
                table: "ContactAppointmentAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_IsDeleted",
                table: "ContactAppointmentAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_Modified",
                table: "ContactAppointmentAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_ModifiedByContactID",
                table: "ContactAppointmentAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_OrderFlag",
                table: "ContactAppointmentAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_StatusFlag",
                table: "ContactAppointmentAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_TypeFlag",
                table: "ContactAppointmentAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_UID",
                table: "ContactAppointmentAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_Created",
                table: "ImageLibraryEntities",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_CreatedByContactID",
                table: "ImageLibraryEntities",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_Filename",
                table: "ImageLibraryEntities",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_IsDeleted",
                table: "ImageLibraryEntities",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_Modified",
                table: "ImageLibraryEntities",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_ModifiedByContactID",
                table: "ImageLibraryEntities",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_OrderFlag",
                table: "ImageLibraryEntities",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_StatusFlag",
                table: "ImageLibraryEntities",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_TypeFlag",
                table: "ImageLibraryEntities",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ImageLibraryEntities_UID",
                table: "ImageLibraryEntities",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_Created",
                table: "PackageAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_CreatedByContactID",
                table: "PackageAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_Filename",
                table: "PackageAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_IsDeleted",
                table: "PackageAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_Modified",
                table: "PackageAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_ModifiedByContactID",
                table: "PackageAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_OrderFlag",
                table: "PackageAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_PackageID",
                table: "PackageAttachments",
                column: "PackageID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_StatusFlag",
                table: "PackageAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_TypeFlag",
                table: "PackageAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageAttachments_UID",
                table: "PackageAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_Created",
                table: "PackageContacts",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_CreatedByContactID",
                table: "PackageContacts",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_IsDeleted",
                table: "PackageContacts",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_Modified",
                table: "PackageContacts",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_ModifiedByContactID",
                table: "PackageContacts",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_OrderFlag",
                table: "PackageContacts",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_PackageID",
                table: "PackageContacts",
                column: "PackageID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_StatusFlag",
                table: "PackageContacts",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_TypeFlag",
                table: "PackageContacts",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageContacts_UID",
                table: "PackageContacts",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_Created",
                table: "Packages",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_CreatedByContactID",
                table: "Packages",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_DueDate",
                table: "Packages",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_IsDeleted",
                table: "Packages",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_Modified",
                table: "Packages",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_ModifiedByContactID",
                table: "Packages",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_OrderFlag",
                table: "Packages",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_ProjectAreaID",
                table: "Packages",
                column: "ProjectAreaID");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_ProjectStageID",
                table: "Packages",
                column: "ProjectStageID");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_StartDate",
                table: "Packages",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_StatusFlag",
                table: "Packages",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_SubmissionDate",
                table: "Packages",
                column: "SubmissionDate");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_Title",
                table: "Packages",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_TypeFlag",
                table: "Packages",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Packages_UID",
                table: "Packages",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_Created",
                table: "PackageStudioWorkAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_CreatedByContactID",
                table: "PackageStudioWorkAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_Filename",
                table: "PackageStudioWorkAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_IsDeleted",
                table: "PackageStudioWorkAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_Modified",
                table: "PackageStudioWorkAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_ModifiedByContactID",
                table: "PackageStudioWorkAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_OrderFlag",
                table: "PackageStudioWorkAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_PackageStudioWorkID",
                table: "PackageStudioWorkAttachments",
                column: "PackageStudioWorkID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_StatusFlag",
                table: "PackageStudioWorkAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_TypeFlag",
                table: "PackageStudioWorkAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorkAttachments_UID",
                table: "PackageStudioWorkAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_AssigneeContactID",
                table: "PackageStudioWorks",
                column: "AssigneeContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_AssignerContactID",
                table: "PackageStudioWorks",
                column: "AssignerContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_CompletedDate",
                table: "PackageStudioWorks",
                column: "CompletedDate");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_Created",
                table: "PackageStudioWorks",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_CreatedByContactID",
                table: "PackageStudioWorks",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_DueDate",
                table: "PackageStudioWorks",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_IsDeleted",
                table: "PackageStudioWorks",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_Modified",
                table: "PackageStudioWorks",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_ModifiedByContactID",
                table: "PackageStudioWorks",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_OrderFlag",
                table: "PackageStudioWorks",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_PackageID",
                table: "PackageStudioWorks",
                column: "PackageID");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_StartDate",
                table: "PackageStudioWorks",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_StatusFlag",
                table: "PackageStudioWorks",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_TypeFlag",
                table: "PackageStudioWorks",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_PackageStudioWorks_UID",
                table: "PackageStudioWorks",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_Created",
                table: "ProjectAreas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_CreatedByContactID",
                table: "ProjectAreas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_IsDeleted",
                table: "ProjectAreas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_Modified",
                table: "ProjectAreas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_ModifiedByContactID",
                table: "ProjectAreas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_OrderFlag",
                table: "ProjectAreas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_ParentID",
                table: "ProjectAreas",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_Percentage",
                table: "ProjectAreas",
                column: "Percentage");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_ProjectID",
                table: "ProjectAreas",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_StatusFlag",
                table: "ProjectAreas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_Title",
                table: "ProjectAreas",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_TypeFlag",
                table: "ProjectAreas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreas_UID",
                table: "ProjectAreas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_Created",
                table: "ProjectAreaStageDeliveries",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_CreatedByContactID",
                table: "ProjectAreaStageDeliveries",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_IsDeleted",
                table: "ProjectAreaStageDeliveries",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_Modified",
                table: "ProjectAreaStageDeliveries",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_ModifiedByContactID",
                table: "ProjectAreaStageDeliveries",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_OrderFlag",
                table: "ProjectAreaStageDeliveries",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_ProjectAreaStageID",
                table: "ProjectAreaStageDeliveries",
                column: "ProjectAreaStageID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_StatusFlag",
                table: "ProjectAreaStageDeliveries",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_TypeFlag",
                table: "ProjectAreaStageDeliveries",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStageDeliveries_UID",
                table: "ProjectAreaStageDeliveries",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_Abbreviation",
                table: "ProjectAreaStages",
                column: "Abbreviation");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_Created",
                table: "ProjectAreaStages",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_CreatedByContactID",
                table: "ProjectAreaStages",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_IsDeleted",
                table: "ProjectAreaStages",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_Modified",
                table: "ProjectAreaStages",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_ModifiedByContactID",
                table: "ProjectAreaStages",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_OrderFlag",
                table: "ProjectAreaStages",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_Percentage",
                table: "ProjectAreaStages",
                column: "Percentage");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_ProjectAreaID",
                table: "ProjectAreaStages",
                column: "ProjectAreaID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_StatusFlag",
                table: "ProjectAreaStages",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_Title",
                table: "ProjectAreaStages",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_TypeFlag",
                table: "ProjectAreaStages",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAreaStages_UID",
                table: "ProjectAreaStages",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_Created",
                table: "ProjectStageDeliveries",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_CreatedByContactID",
                table: "ProjectStageDeliveries",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_IsDeleted",
                table: "ProjectStageDeliveries",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_Modified",
                table: "ProjectStageDeliveries",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_ModifiedByContactID",
                table: "ProjectStageDeliveries",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_OrderFlag",
                table: "ProjectStageDeliveries",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_ProjectStageID",
                table: "ProjectStageDeliveries",
                column: "ProjectStageID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_StatusFlag",
                table: "ProjectStageDeliveries",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_TypeFlag",
                table: "ProjectStageDeliveries",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageDeliveries_UID",
                table: "ProjectStageDeliveries",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_Created",
                table: "ProjectStageMasterDeliveries",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_CreatedByContactID",
                table: "ProjectStageMasterDeliveries",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_IsDeleted",
                table: "ProjectStageMasterDeliveries",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_Modified",
                table: "ProjectStageMasterDeliveries",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_ModifiedByContactID",
                table: "ProjectStageMasterDeliveries",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_OrderFlag",
                table: "ProjectStageMasterDeliveries",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_ProjectStageMasterID",
                table: "ProjectStageMasterDeliveries",
                column: "ProjectStageMasterID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_StatusFlag",
                table: "ProjectStageMasterDeliveries",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_TypeFlag",
                table: "ProjectStageMasterDeliveries",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasterDeliveries_UID",
                table: "ProjectStageMasterDeliveries",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_Created",
                table: "SpecificationAccessories",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_CreatedByContactID",
                table: "SpecificationAccessories",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_IsDeleted",
                table: "SpecificationAccessories",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_Modified",
                table: "SpecificationAccessories",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_ModifiedByContactID",
                table: "SpecificationAccessories",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_OrderFlag",
                table: "SpecificationAccessories",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_SpecificationID",
                table: "SpecificationAccessories",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_StatusFlag",
                table: "SpecificationAccessories",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_Title",
                table: "SpecificationAccessories",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_TypeFlag",
                table: "SpecificationAccessories",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAccessories_UID",
                table: "SpecificationAccessories",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_Created",
                table: "SpecificationAreaAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_CreatedByContactID",
                table: "SpecificationAreaAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_Filename",
                table: "SpecificationAreaAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_IsDeleted",
                table: "SpecificationAreaAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_Modified",
                table: "SpecificationAreaAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_ModifiedByContactID",
                table: "SpecificationAreaAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_OrderFlag",
                table: "SpecificationAreaAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_SpecificationAreaID",
                table: "SpecificationAreaAttachments",
                column: "SpecificationAreaID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_StatusFlag",
                table: "SpecificationAreaAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_TypeFlag",
                table: "SpecificationAreaAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreaAttachments_UID",
                table: "SpecificationAreaAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_Created",
                table: "SpecificationAreas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_CreatedByContactID",
                table: "SpecificationAreas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_IsDeleted",
                table: "SpecificationAreas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_Modified",
                table: "SpecificationAreas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_ModifiedByContactID",
                table: "SpecificationAreas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_OrderFlag",
                table: "SpecificationAreas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_ParentID",
                table: "SpecificationAreas",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_StatusFlag",
                table: "SpecificationAreas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_Title",
                table: "SpecificationAreas",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_TypeFlag",
                table: "SpecificationAreas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAreas_UID",
                table: "SpecificationAreas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_Created",
                table: "SpecificationAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_CreatedByContactID",
                table: "SpecificationAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_Filename",
                table: "SpecificationAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_IsDeleted",
                table: "SpecificationAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_Modified",
                table: "SpecificationAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_ModifiedByContactID",
                table: "SpecificationAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_OrderFlag",
                table: "SpecificationAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_SpecificationID",
                table: "SpecificationAttachments",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_StatusFlag",
                table: "SpecificationAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_TypeFlag",
                table: "SpecificationAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttachments_UID",
                table: "SpecificationAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_Attribute",
                table: "SpecificationAttributeMasters",
                column: "Attribute");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_Created",
                table: "SpecificationAttributeMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_CreatedByContactID",
                table: "SpecificationAttributeMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_IsDeleted",
                table: "SpecificationAttributeMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_IsRequired",
                table: "SpecificationAttributeMasters",
                column: "IsRequired");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_Modified",
                table: "SpecificationAttributeMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_ModifiedByContactID",
                table: "SpecificationAttributeMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_OrderFlag",
                table: "SpecificationAttributeMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_ShowInList",
                table: "SpecificationAttributeMasters",
                column: "ShowInList");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_ShowInReport",
                table: "SpecificationAttributeMasters",
                column: "ShowInReport");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_StatusFlag",
                table: "SpecificationAttributeMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_TypeFlag",
                table: "SpecificationAttributeMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributeMasters_UID",
                table: "SpecificationAttributeMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_AttributeKey",
                table: "SpecificationAttributes",
                column: "AttributeKey");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_Created",
                table: "SpecificationAttributes",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_CreatedByContactID",
                table: "SpecificationAttributes",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_IsDeleted",
                table: "SpecificationAttributes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_Modified",
                table: "SpecificationAttributes",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_ModifiedByContactID",
                table: "SpecificationAttributes",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_OrderFlag",
                table: "SpecificationAttributes",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_SpecificationID",
                table: "SpecificationAttributes",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_StatusFlag",
                table: "SpecificationAttributes",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_TypeFlag",
                table: "SpecificationAttributes",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationAttributes_UID",
                table: "SpecificationAttributes",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Category",
                table: "SpecificationLibraryEntities",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Code",
                table: "SpecificationLibraryEntities",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_CodeFlag",
                table: "SpecificationLibraryEntities",
                column: "CodeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Created",
                table: "SpecificationLibraryEntities",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_CreatedByContactID",
                table: "SpecificationLibraryEntities",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_IsDeleted",
                table: "SpecificationLibraryEntities",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Modified",
                table: "SpecificationLibraryEntities",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_ModifiedByContactID",
                table: "SpecificationLibraryEntities",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_OrderFlag",
                table: "SpecificationLibraryEntities",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_StatusFlag",
                table: "SpecificationLibraryEntities",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Subtitle",
                table: "SpecificationLibraryEntities",
                column: "Subtitle");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_Title",
                table: "SpecificationLibraryEntities",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_TypeFlag",
                table: "SpecificationLibraryEntities",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntities_UID",
                table: "SpecificationLibraryEntities",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_Created",
                table: "SpecificationLibraryEntityAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_CreatedByContactID",
                table: "SpecificationLibraryEntityAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_Filename",
                table: "SpecificationLibraryEntityAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_IsDeleted",
                table: "SpecificationLibraryEntityAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_Modified",
                table: "SpecificationLibraryEntityAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_ModifiedByContactID",
                table: "SpecificationLibraryEntityAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_OrderFlag",
                table: "SpecificationLibraryEntityAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_SpecificationLibraryEntityID",
                table: "SpecificationLibraryEntityAttachments",
                column: "SpecificationLibraryEntityID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_StatusFlag",
                table: "SpecificationLibraryEntityAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_TypeFlag",
                table: "SpecificationLibraryEntityAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttachments_UID",
                table: "SpecificationLibraryEntityAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_AttributeKey",
                table: "SpecificationLibraryEntityAttributes",
                column: "AttributeKey");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_Created",
                table: "SpecificationLibraryEntityAttributes",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_CreatedByContactID",
                table: "SpecificationLibraryEntityAttributes",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_IsDeleted",
                table: "SpecificationLibraryEntityAttributes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_Modified",
                table: "SpecificationLibraryEntityAttributes",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_ModifiedByContactID",
                table: "SpecificationLibraryEntityAttributes",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_OrderFlag",
                table: "SpecificationLibraryEntityAttributes",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_SpecificationLibraryEntityID",
                table: "SpecificationLibraryEntityAttributes",
                column: "SpecificationLibraryEntityID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_StatusFlag",
                table: "SpecificationLibraryEntityAttributes",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_TypeFlag",
                table: "SpecificationLibraryEntityAttributes",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLibraryEntityAttributes_UID",
                table: "SpecificationLibraryEntityAttributes",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_Created",
                table: "SpecificationLinearSegments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_CreatedByContactID",
                table: "SpecificationLinearSegments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_IsDeleted",
                table: "SpecificationLinearSegments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_Modified",
                table: "SpecificationLinearSegments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_ModifiedByContactID",
                table: "SpecificationLinearSegments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_OrderFlag",
                table: "SpecificationLinearSegments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_SpecificationID",
                table: "SpecificationLinearSegments",
                column: "SpecificationID");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_StatusFlag",
                table: "SpecificationLinearSegments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_Title",
                table: "SpecificationLinearSegments",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_TypeFlag",
                table: "SpecificationLinearSegments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_SpecificationLinearSegments_UID",
                table: "SpecificationLinearSegments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_Created",
                table: "Specifications",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_CreatedByContactID",
                table: "Specifications",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_IsDeleted",
                table: "Specifications",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_IsReadOnly",
                table: "Specifications",
                column: "IsReadOnly");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_Modified",
                table: "Specifications",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ModifiedByContactID",
                table: "Specifications",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_OrderFlag",
                table: "Specifications",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ParentID",
                table: "Specifications",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ProjectID",
                table: "Specifications",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_ReferenceTag",
                table: "Specifications",
                column: "ReferenceTag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_RevisionNumber",
                table: "Specifications",
                column: "RevisionNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_SpecificationAreaID",
                table: "Specifications",
                column: "SpecificationAreaID");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_StatusFlag",
                table: "Specifications",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_TypeFlag",
                table: "Specifications",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Specifications_UID",
                table: "Specifications",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WebPushSubscriptions_Username",
                table: "WebPushSubscriptions",
                column: "Username");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAssociations_Contacts_CompanyContactID",
                table: "ContactAssociations",
                column: "CompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAssociations_Contacts_PersonContactID",
                table: "ContactAssociations",
                column: "PersonContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects",
                column: "ClientContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects",
                column: "ReferredByContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_WFTasks_Contacts_AssignerContactID",
                table: "WFTasks",
                column: "AssignerContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactAssociations_Contacts_CompanyContactID",
                table: "ContactAssociations");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactAssociations_Contacts_PersonContactID",
                table: "ContactAssociations");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects");

            migrationBuilder.DropForeignKey(
                name: "FK_WFTasks_Contacts_AssignerContactID",
                table: "WFTasks");

            migrationBuilder.DropTable(
                name: "ImageLibraryEntities");

            migrationBuilder.DropTable(
                name: "PackageAttachments");

            migrationBuilder.DropTable(
                name: "PackageContacts");

            migrationBuilder.DropTable(
                name: "PackageStudioWorkAttachments");

            migrationBuilder.DropTable(
                name: "ProjectAreaStageDeliveries");

            migrationBuilder.DropTable(
                name: "ProjectStageDeliveries");

            migrationBuilder.DropTable(
                name: "ProjectStageMasterDeliveries");

            migrationBuilder.DropTable(
                name: "SpecificationAccessories");

            migrationBuilder.DropTable(
                name: "SpecificationAreaAttachments");

            migrationBuilder.DropTable(
                name: "SpecificationAttachments");

            migrationBuilder.DropTable(
                name: "SpecificationAttributeMasters");

            migrationBuilder.DropTable(
                name: "SpecificationAttributes");

            migrationBuilder.DropTable(
                name: "SpecificationLibraryEntityAttachments");

            migrationBuilder.DropTable(
                name: "SpecificationLibraryEntityAttributes");

            migrationBuilder.DropTable(
                name: "SpecificationLinearSegments");

            migrationBuilder.DropTable(
                name: "WebPushSubscriptions");

            migrationBuilder.DropTable(
                name: "PackageStudioWorks");

            migrationBuilder.DropTable(
                name: "ProjectAreaStages");

            migrationBuilder.DropTable(
                name: "SpecificationLibraryEntities");

            migrationBuilder.DropTable(
                name: "Specifications");

            migrationBuilder.DropTable(
                name: "Packages");

            migrationBuilder.DropTable(
                name: "ProjectAreas");

            migrationBuilder.DropTable(
                name: "SpecificationAreas");

            migrationBuilder.DropIndex(
                name: "IX_ProjectStages_Abbreviation",
                table: "ProjectStages");

            migrationBuilder.DropIndex(
                name: "IX_ProjectStages_Percentage",
                table: "ProjectStages");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_Created",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_CreatedByContactID",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_IsDeleted",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_Modified",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_ModifiedByContactID",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_OrderFlag",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_StatusFlag",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_TypeFlag",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropIndex(
                name: "IX_ContactAppointmentAttachments_UID",
                table: "ContactAppointmentAttachments");

            migrationBuilder.DropColumn(
                name: "IsRepeatRequired",
                table: "RequestTickets");

            migrationBuilder.DropColumn(
                name: "Abbreviation",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "Percentage",
                table: "ProjectStages");

            migrationBuilder.DropColumn(
                name: "StateCode",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "DrivingLicenseNo",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "PhotoFilename",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Urls",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "_addresses",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "_emails",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "_phones",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "BankAccountNo",
                table: "ContactAppointments");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "ProjectStages",
                newName: "StageTitle");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectStages_Title",
                table: "ProjectStages",
                newName: "IX_ProjectStages_StageTitle");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "ProjectStageMasters",
                newName: "StageTitle");

            migrationBuilder.RenameColumn(
                name: "Percentage",
                table: "ProjectStageMasters",
                newName: "StageValue");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectStageMasters_Title",
                table: "ProjectStageMasters",
                newName: "IX_ProjectStageMasters_StageTitle");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectStageMasters_Percentage",
                table: "ProjectStageMasters",
                newName: "IX_ProjectStageMasters_StageValue");

            migrationBuilder.RenameColumn(
                name: "SearchTags",
                table: "ContactAppointmentAttachments",
                newName: "_searchTags");

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrRate",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrConsumedCost",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrConsumed",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssignedCost",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssigned",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssessedCost",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrAssessed",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "WFTasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Subtitle",
                table: "WFTasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<decimal>(
                name: "ManValue",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrConsumed",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssigned",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssessed",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Entity",
                table: "WFTasks",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "AssessmentPoints",
                table: "WFTasks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Subtitle",
                table: "RequestTickets",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "StageValue",
                table: "ProjectStages",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApplicableFromDate",
                table: "ProjectStageMasters",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "ApplicableTillDate",
                table: "ProjectStageMasters",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "State",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PinCode",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Projects",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "LandscapeArea",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "InteriorArea",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "FacadeArea",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedMHr",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "Projects",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyID",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "BillingTitle",
                table: "Projects",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GSTStateCode",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Contacts",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "ManValue",
                table: "ContactAppointments",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedVhr",
                table: "ContactAppointments",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedRemuneration",
                table: "ContactAppointments",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AlterColumn<Guid>(
                name: "UID",
                table: "ContactAppointmentAttachments",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldDefaultValueSql: "NEWID()");

            migrationBuilder.AlterColumn<int>(
                name: "TypeFlag",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "StatusFlag",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "OrderFlag",
                table: "ContactAppointmentAttachments",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "ModifiedBy",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "ContactAppointmentAttachments",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "Filename",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ContentType",
                table: "ContactAppointmentAttachments",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ContactID",
                table: "Companies",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Points",
                table: "AssessmentMasters",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.CreateTable(
                name: "ContactAddresses",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Area = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    City = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    PinCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    State = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactAddresses", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactAddresses_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactEmails",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactEmails", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactEmails_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactNotes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactNotes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactNotes_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactPhones",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Phone = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactPhones", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactPhones_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Template = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWorkOrderMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrders",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AreaTitle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BlobUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    InteriorCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Share = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    WorkDetail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WorkOrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WorkOrderNo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    WorkProposalTemplate = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWorkOrders", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrders_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderSegmentMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectWorkOrderMasterID = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWorkOrderSegmentMasters", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderSegmentMasters_ProjectWorkOrderMasters_ProjectWorkOrderMasterID",
                        column: x => x.ProjectWorkOrderMasterID,
                        principalTable: "ProjectWorkOrderMasters",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderAreas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectWorkOrderID = table.Column<int>(type: "int", nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AreaTitle = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fees = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Rate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Share = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Unit = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWorkOrderAreas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderAreas_ProjectWorkOrders_ProjectWorkOrderID",
                        column: x => x.ProjectWorkOrderID,
                        principalTable: "ProjectWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectWorkOrderID = table.Column<int>(type: "int", nullable: false),
                    BlobPath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Container = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Filename = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Guidname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    OriginalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<int>(type: "int", nullable: false),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ThumbFilename = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWorkOrderAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderAttachments_ProjectWorkOrders_ProjectWorkOrderID",
                        column: x => x.ProjectWorkOrderID,
                        principalTable: "ProjectWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWorkOrderSegments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectWorkOrderID = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedByContactID = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Modified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ModifiedByContactID = table.Column<int>(type: "int", nullable: true),
                    OrderFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    StatusFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TypeFlag = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    UID = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWID()"),
                    SearchTags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWorkOrderSegments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectWorkOrderSegments_ProjectWorkOrders_ProjectWorkOrderID",
                        column: x => x.ProjectWorkOrderID,
                        principalTable: "ProjectWorkOrders",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserID",
                table: "RefreshTokens",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStages_StageValue",
                table: "ProjectStages",
                column: "StageValue");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_ApplicableFromDate",
                table: "ProjectStageMasters",
                column: "ApplicableFromDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectStageMasters_ApplicableTillDate",
                table: "ProjectStageMasters",
                column: "ApplicableTillDate");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_City",
                table: "Projects",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ContractCompletionDate",
                table: "Projects",
                column: "ContractCompletionDate");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ExpectedCompletionDate",
                table: "Projects",
                column: "ExpectedCompletionDate");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_InquiryConvertionDate",
                table: "Projects",
                column: "InquiryConvertionDate");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_PinCode",
                table: "Projects",
                column: "PinCode");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_State",
                table: "Projects",
                column: "State");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Anniversary",
                table: "Contacts",
                column: "Anniversary");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Birth",
                table: "Contacts",
                column: "Birth");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_FirstName",
                table: "Contacts",
                column: "FirstName");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_FullName",
                table: "Contacts",
                column: "FullName");

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

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointmentAttachments_Filename",
                table: "ContactAppointmentAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_Area",
                table: "ContactAddresses",
                column: "Area");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_City",
                table: "ContactAddresses",
                column: "City");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_ContactID",
                table: "ContactAddresses",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_Country",
                table: "ContactAddresses",
                column: "Country");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_Created",
                table: "ContactAddresses",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_CreatedByContactID",
                table: "ContactAddresses",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_IsDeleted",
                table: "ContactAddresses",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_IsPrimary",
                table: "ContactAddresses",
                column: "IsPrimary");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_Modified",
                table: "ContactAddresses",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_ModifiedByContactID",
                table: "ContactAddresses",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_OrderFlag",
                table: "ContactAddresses",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_PinCode",
                table: "ContactAddresses",
                column: "PinCode");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_State",
                table: "ContactAddresses",
                column: "State");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_StatusFlag",
                table: "ContactAddresses",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_Title",
                table: "ContactAddresses",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_TypeFlag",
                table: "ContactAddresses",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAddresses_UID",
                table: "ContactAddresses",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_ContactID",
                table: "ContactEmails",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_Created",
                table: "ContactEmails",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_CreatedByContactID",
                table: "ContactEmails",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_Email",
                table: "ContactEmails",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_IsDeleted",
                table: "ContactEmails",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_IsPrimary",
                table: "ContactEmails",
                column: "IsPrimary");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_Modified",
                table: "ContactEmails",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_ModifiedByContactID",
                table: "ContactEmails",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_OrderFlag",
                table: "ContactEmails",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_StatusFlag",
                table: "ContactEmails",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_Title",
                table: "ContactEmails",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_TypeFlag",
                table: "ContactEmails",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactEmails_UID",
                table: "ContactEmails",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_ContactID",
                table: "ContactNotes",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_Created",
                table: "ContactNotes",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_CreatedByContactID",
                table: "ContactNotes",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_IsDeleted",
                table: "ContactNotes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_Modified",
                table: "ContactNotes",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_ModifiedByContactID",
                table: "ContactNotes",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_OrderFlag",
                table: "ContactNotes",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_StatusFlag",
                table: "ContactNotes",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_TypeFlag",
                table: "ContactNotes",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactNotes_UID",
                table: "ContactNotes",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_ContactID",
                table: "ContactPhones",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_Created",
                table: "ContactPhones",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_CreatedByContactID",
                table: "ContactPhones",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_IsDeleted",
                table: "ContactPhones",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_IsPrimary",
                table: "ContactPhones",
                column: "IsPrimary");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_Modified",
                table: "ContactPhones",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_ModifiedByContactID",
                table: "ContactPhones",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_OrderFlag",
                table: "ContactPhones",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_Phone",
                table: "ContactPhones",
                column: "Phone");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_StatusFlag",
                table: "ContactPhones",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_Title",
                table: "ContactPhones",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_TypeFlag",
                table: "ContactPhones",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactPhones_UID",
                table: "ContactPhones",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_Area",
                table: "ProjectWorkOrderAreas",
                column: "Area");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_AreaTitle",
                table: "ProjectWorkOrderAreas",
                column: "AreaTitle");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_Created",
                table: "ProjectWorkOrderAreas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_CreatedByContactID",
                table: "ProjectWorkOrderAreas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_IsDeleted",
                table: "ProjectWorkOrderAreas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_Modified",
                table: "ProjectWorkOrderAreas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_ModifiedByContactID",
                table: "ProjectWorkOrderAreas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_OrderFlag",
                table: "ProjectWorkOrderAreas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_ProjectWorkOrderID",
                table: "ProjectWorkOrderAreas",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_StatusFlag",
                table: "ProjectWorkOrderAreas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_TypeFlag",
                table: "ProjectWorkOrderAreas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAreas_UID",
                table: "ProjectWorkOrderAreas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_Created",
                table: "ProjectWorkOrderAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_CreatedByContactID",
                table: "ProjectWorkOrderAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_Filename",
                table: "ProjectWorkOrderAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_IsDeleted",
                table: "ProjectWorkOrderAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_Modified",
                table: "ProjectWorkOrderAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_ModifiedByContactID",
                table: "ProjectWorkOrderAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_OrderFlag",
                table: "ProjectWorkOrderAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_ProjectWorkOrderID",
                table: "ProjectWorkOrderAttachments",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_StatusFlag",
                table: "ProjectWorkOrderAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_TypeFlag",
                table: "ProjectWorkOrderAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderAttachments_UID",
                table: "ProjectWorkOrderAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_Created",
                table: "ProjectWorkOrderMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_CreatedByContactID",
                table: "ProjectWorkOrderMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_IsDeleted",
                table: "ProjectWorkOrderMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_Modified",
                table: "ProjectWorkOrderMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_ModifiedByContactID",
                table: "ProjectWorkOrderMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_OrderFlag",
                table: "ProjectWorkOrderMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_StatusFlag",
                table: "ProjectWorkOrderMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_Template",
                table: "ProjectWorkOrderMasters",
                column: "Template");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_TypeFlag",
                table: "ProjectWorkOrderMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderMasters_UID",
                table: "ProjectWorkOrderMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_Area",
                table: "ProjectWorkOrders",
                column: "Area");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_AreaTitle",
                table: "ProjectWorkOrders",
                column: "AreaTitle");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_Created",
                table: "ProjectWorkOrders",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_CreatedByContactID",
                table: "ProjectWorkOrders",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_IsDeleted",
                table: "ProjectWorkOrders",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_Modified",
                table: "ProjectWorkOrders",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_ModifiedByContactID",
                table: "ProjectWorkOrders",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_OrderFlag",
                table: "ProjectWorkOrders",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_ProjectID",
                table: "ProjectWorkOrders",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_StatusFlag",
                table: "ProjectWorkOrders",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_TypeFlag",
                table: "ProjectWorkOrders",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_UID",
                table: "ProjectWorkOrders",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_WorkOrderDate",
                table: "ProjectWorkOrders",
                column: "WorkOrderDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrders_WorkOrderNo",
                table: "ProjectWorkOrders",
                column: "WorkOrderNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_Created",
                table: "ProjectWorkOrderSegmentMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_CreatedByContactID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_IsDeleted",
                table: "ProjectWorkOrderSegmentMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_Modified",
                table: "ProjectWorkOrderSegmentMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_ModifiedByContactID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_OrderFlag",
                table: "ProjectWorkOrderSegmentMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_ProjectWorkOrderMasterID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "ProjectWorkOrderMasterID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_StatusFlag",
                table: "ProjectWorkOrderSegmentMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_Title",
                table: "ProjectWorkOrderSegmentMasters",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_TypeFlag",
                table: "ProjectWorkOrderSegmentMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegmentMasters_UID",
                table: "ProjectWorkOrderSegmentMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_Created",
                table: "ProjectWorkOrderSegments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_CreatedByContactID",
                table: "ProjectWorkOrderSegments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_IsDeleted",
                table: "ProjectWorkOrderSegments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_Modified",
                table: "ProjectWorkOrderSegments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_ModifiedByContactID",
                table: "ProjectWorkOrderSegments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_OrderFlag",
                table: "ProjectWorkOrderSegments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_ProjectWorkOrderID",
                table: "ProjectWorkOrderSegments",
                column: "ProjectWorkOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_StatusFlag",
                table: "ProjectWorkOrderSegments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_Title",
                table: "ProjectWorkOrderSegments",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_TypeFlag",
                table: "ProjectWorkOrderSegments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWorkOrderSegments_UID",
                table: "ProjectWorkOrderSegments",
                column: "UID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAssociations_Contacts_CompanyContactID",
                table: "ContactAssociations",
                column: "CompanyContactID",
                principalTable: "Contacts",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactAssociations_Contacts_PersonContactID",
                table: "ContactAssociations",
                column: "PersonContactID",
                principalTable: "Contacts",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ClientContactID",
                table: "Projects",
                column: "ClientContactID",
                principalTable: "Contacts",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_Contacts_ReferredByContactID",
                table: "Projects",
                column: "ReferredByContactID",
                principalTable: "Contacts",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_AspNetUsers_UserID",
                table: "RefreshTokens",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WFTasks_Contacts_AssignerContactID",
                table: "WFTasks",
                column: "AssignerContactID",
                principalTable: "Contacts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
