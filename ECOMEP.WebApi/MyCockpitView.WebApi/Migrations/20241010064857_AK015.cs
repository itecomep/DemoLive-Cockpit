using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK015 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacadeArea",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "InteriorArea",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "LandscapeArea",
                table: "Projects");

            migrationBuilder.AlterColumn<decimal>(
                name: "DueDays",
                table: "WFStages",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "WFStages",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Todos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "SubTitle",
                table: "Todos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrConsumed",
                table: "Todos",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssigned",
                table: "Todos",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ValueHourRate",
                table: "TimeEntries",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ManValue",
                table: "TimeEntries",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ManHours",
                table: "TimeEntries",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ReminderInterval",
                table: "RequestTickets",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<string>(
                name: "StateCode",
                table: "Projects",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

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

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "Projects",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedMHr",
                table: "Projects",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "Projects",
                type: "decimal(18,2)",
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

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrConsumed",
                table: "PackageStudioWorks",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssigned",
                table: "PackageStudioWorks",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Version",
                table: "Meetings",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Progress",
                table: "MeetingAgendas",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "PreviousProgress",
                table: "MeetingAgendas",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrRate",
                table: "Companies",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "ScoredPoints",
                table: "Assessments",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Points",
                table: "Assessments",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(14,2)",
                oldPrecision: 14,
                oldScale: 2);

            migrationBuilder.CreateTable(
                name: "ProjectBills",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BillNo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SequenceNo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsLumpSump = table.Column<bool>(type: "bit", nullable: false),
                    BillPercentage = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    WorkPercentage = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BillDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Tax = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxSplit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GSTShare = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GSTAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IGSTShare = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IGSTAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CGSTShare = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CGSTAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SGSTShare = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SGSTAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GSTFlag = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PreviousAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Payable = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ClientName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClientAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReverseTaxCharges = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GSTIN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HSN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PAN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TAN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AmountInWords = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StateCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TotalAreaOfConstructon = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalAreaFees = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    BlobUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BlobUrlWithoutLetterHead = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    _stages = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_ProjectBills", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectBills_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectBillPayments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Mode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TDS = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsTDSPaid = table.Column<bool>(type: "bit", nullable: false),
                    TDSRate = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransactionNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransactionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BankDetail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefGuid = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectBillID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectBillPayments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectBillPayments_ProjectBills_ProjectBillID",
                        column: x => x.ProjectBillID,
                        principalTable: "ProjectBills",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectBillPaymentAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectBillPaymentID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectBillPaymentAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectBillPaymentAttachments_ProjectBillPayments_ProjectBillPaymentID",
                        column: x => x.ProjectBillPaymentID,
                        principalTable: "ProjectBillPayments",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_Created",
                table: "ProjectBillPaymentAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_CreatedByContactID",
                table: "ProjectBillPaymentAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_Filename",
                table: "ProjectBillPaymentAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_IsDeleted",
                table: "ProjectBillPaymentAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_Modified",
                table: "ProjectBillPaymentAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_ModifiedByContactID",
                table: "ProjectBillPaymentAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_OrderFlag",
                table: "ProjectBillPaymentAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_ProjectBillPaymentID",
                table: "ProjectBillPaymentAttachments",
                column: "ProjectBillPaymentID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_StatusFlag",
                table: "ProjectBillPaymentAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_TypeFlag",
                table: "ProjectBillPaymentAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPaymentAttachments_UID",
                table: "ProjectBillPaymentAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_Created",
                table: "ProjectBillPayments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_CreatedByContactID",
                table: "ProjectBillPayments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_IsDeleted",
                table: "ProjectBillPayments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_Modified",
                table: "ProjectBillPayments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_ModifiedByContactID",
                table: "ProjectBillPayments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_OrderFlag",
                table: "ProjectBillPayments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_ProjectBillID",
                table: "ProjectBillPayments",
                column: "ProjectBillID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_StatusFlag",
                table: "ProjectBillPayments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_TypeFlag",
                table: "ProjectBillPayments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBillPayments_UID",
                table: "ProjectBillPayments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_BillDate",
                table: "ProjectBills",
                column: "BillDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_BillNo",
                table: "ProjectBills",
                column: "BillNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_BillPercentage",
                table: "ProjectBills",
                column: "BillPercentage");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_Created",
                table: "ProjectBills",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_CreatedByContactID",
                table: "ProjectBills",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_IsDeleted",
                table: "ProjectBills",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_Modified",
                table: "ProjectBills",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_ModifiedByContactID",
                table: "ProjectBills",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_OrderFlag",
                table: "ProjectBills",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_ProjectID",
                table: "ProjectBills",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_SequenceNo",
                table: "ProjectBills",
                column: "SequenceNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_StatusFlag",
                table: "ProjectBills",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_TypeFlag",
                table: "ProjectBills",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectBills_UID",
                table: "ProjectBills",
                column: "UID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectBillPaymentAttachments");

            migrationBuilder.DropTable(
                name: "ProjectBillPayments");

            migrationBuilder.DropTable(
                name: "ProjectBills");

            migrationBuilder.AlterColumn<decimal>(
                name: "DueDays",
                table: "WFStages",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "WFStages",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Todos",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SubTitle",
                table: "Todos",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrConsumed",
                table: "Todos",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssigned",
                table: "Todos",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ValueHourRate",
                table: "TimeEntries",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ManValue",
                table: "TimeEntries",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ManHours",
                table: "TimeEntries",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ReminderInterval",
                table: "RequestTickets",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<string>(
                name: "StateCode",
                table: "Projects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

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

            migrationBuilder.AlterColumn<decimal>(
                name: "Fee",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ExpectedMHr",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

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

            migrationBuilder.AddColumn<decimal>(
                name: "FacadeArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "InteriorArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LandscapeArea",
                table: "Projects",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrConsumed",
                table: "PackageStudioWorks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "MHrAssigned",
                table: "PackageStudioWorks",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Version",
                table: "Meetings",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Progress",
                table: "MeetingAgendas",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "PreviousProgress",
                table: "MeetingAgendas",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "VHrRate",
                table: "Companies",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "ScoredPoints",
                table: "Assessments",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Points",
                table: "Assessments",
                type: "decimal(14,2)",
                precision: 14,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }
    }
}
