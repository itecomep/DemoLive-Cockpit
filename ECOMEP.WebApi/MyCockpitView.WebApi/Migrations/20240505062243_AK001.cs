using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyCockpitView.WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AK001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Action = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WFTaskID = table.Column<int>(type: "int", nullable: true),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    ContactUID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ContactName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactPhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EntityID = table.Column<int>(type: "int", nullable: true),
                    EntityTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                    table.PrimaryKey("PK_Activities", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AppSettingMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PresetKey = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PresetValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_AppSettingMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Module = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsSpecial = table.Column<bool>(type: "bit", nullable: false),
                    IsHidden = table.Column<bool>(type: "bit", nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsChangePassword = table.Column<bool>(type: "bit", nullable: false),
                    AgreementFlag = table.Column<int>(type: "int", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AssessmentMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Points = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
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
                    table.PrimaryKey("PK_AssessmentMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Initials = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    VHrRate = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
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
                    table.PrimaryKey("PK_Companies", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsCompany = table.Column<bool>(type: "bit", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MiddleName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Website = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Birth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Anniversary = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PAN = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TAN = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    GSTIN = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    HSN = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ARN = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PhotoUrl = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Categories = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MaritalStatus = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Adhaar = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FamilyContactName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FamilyContactPhone = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FamilyContactRelation = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EmergencyContactName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EmergencyContactPhone = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EmergencyContactRelation = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    BankName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IFSCCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Source = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Grade = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EmployeeCount = table.Column<int>(type: "int", nullable: false),
                    RelationshipManagerID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_Contacts", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Contacts_Contacts_RelationshipManagerID",
                        column: x => x.RelationshipManagerID,
                        principalTable: "Contacts",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "LoginSessions",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Person = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IpAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BrowserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Device = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeviceType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LogoutDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsOTPRequired = table.Column<bool>(type: "bit", nullable: false),
                    IsOTPVerified = table.Column<bool>(type: "bit", nullable: false),
                    OTP = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_LoginSessions", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "StatusMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Value = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_StatusMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "TypeMasters",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Title = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Value = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_TypeMasters", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "WFStages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TaskTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EntityTypeFlag = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    IsStart = table.Column<bool>(type: "bit", nullable: false),
                    DueDays = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    IsAssignByRole = table.Column<bool>(type: "bit", nullable: false),
                    ShowAssessment = table.Column<bool>(type: "bit", nullable: false),
                    AssessmentForStage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    AssignByProperty = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    AssignByEntityProperty = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ShowComment = table.Column<bool>(type: "bit", nullable: false),
                    ShowFollowUpDate = table.Column<bool>(type: "bit", nullable: false),
                    ShowAttachment = table.Column<bool>(type: "bit", nullable: false),
                    ActionType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsCommentRequired = table.Column<bool>(type: "bit", nullable: false),
                    InitialRevison = table.Column<int>(type: "int", nullable: false),
                    IsAssessmentRequired = table.Column<bool>(type: "bit", nullable: false),
                    IsPreAssignedTimeTask = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_WFStages", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_AspNetUsers_UserID",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactAddresses",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Street = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Area = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    City = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    State = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PinCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_ContactAddresses", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactAddresses_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactAppointments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Designation = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Code = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    JoiningDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResignationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ManValue = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    ExpectedVhr = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    ExpectedRemuneration = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    BankAccountNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ContactAppointments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactAppointments_Companies_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Companies",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ContactAppointments_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactAssociations",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PersonContactID = table.Column<int>(type: "int", nullable: false),
                    CompanyContactID = table.Column<int>(type: "int", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Designation = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                    table.PrimaryKey("PK_ContactAssociations", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactAssociations_Contacts_CompanyContactID",
                        column: x => x.CompanyContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_ContactAssociations_Contacts_PersonContactID",
                        column: x => x.PersonContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "ContactAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ContactAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactAttachments_Contacts_ContactID",
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
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
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
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: false),
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
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_ContactPhones", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ContactPhones_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Meetings",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ClosedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinalizedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Version = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    Annexure = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_Meetings", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Meetings_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    State = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    StateCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ContractCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpectedCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InquiryConvertionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Fee = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    BillingTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CompanyID = table.Column<int>(type: "int", nullable: true),
                    Segment = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ClientContactID = table.Column<int>(type: "int", nullable: true),
                    ReferredByContactID = table.Column<int>(type: "int", nullable: true),
                    ExpectedMHr = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    LandscapeArea = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    FacadeArea = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    InteriorArea = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
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
                    table.PrimaryKey("PK_Projects", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Projects_Companies_CompanyID",
                        column: x => x.CompanyID,
                        principalTable: "Companies",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Projects_Contacts_ClientContactID",
                        column: x => x.ClientContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Projects_Contacts_ReferredByContactID",
                        column: x => x.ReferredByContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequestTickets",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Subtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NextReminderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RequestMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResolutionMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssignerContactID = table.Column<int>(type: "int", nullable: false),
                    ReminderInterval = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    RepeatCount = table.Column<int>(type: "int", nullable: false),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EntityID = table.Column<int>(type: "int", nullable: true),
                    EntityTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_RequestTickets", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RequestTickets_Contacts_AssignerContactID",
                        column: x => x.AssignerContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WFTasks",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignerContactID = table.Column<int>(type: "int", nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Subtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    WFStageCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    StageIndex = table.Column<int>(type: "int", nullable: true),
                    StageRevision = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FollowUpDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OutcomeFlag = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    History = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsPreAssignedTimeTask = table.Column<bool>(type: "bit", nullable: false),
                    CompanyID = table.Column<int>(type: "int", nullable: false),
                    ManValue = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    AssessmentPoints = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    MHrAssigned = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    MHrConsumed = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    MHrAssessed = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    VHrAssigned = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    VHrConsumed = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    VHrAssessed = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    VHrAssignedCost = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    VHrConsumedCost = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    VHrAssessedCost = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    VHrRate = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    IsAssessmentRequired = table.Column<bool>(type: "bit", nullable: false),
                    PreviousStageCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    PreviousStageRevision = table.Column<int>(type: "int", nullable: true),
                    PreviousTaskID = table.Column<int>(type: "int", nullable: true),
                    AssessmentRemark = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EntityID = table.Column<int>(type: "int", nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_WFTasks", x => x.ID);
                    table.ForeignKey(
                        name: "FK_WFTasks_Contacts_AssignerContactID",
                        column: x => x.AssignerContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WFTasks_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WFStageActions",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WFStageID = table.Column<int>(type: "int", nullable: false),
                    TaskOutcomeFlag = table.Column<int>(type: "int", nullable: false),
                    TaskStatusFlag = table.Column<int>(type: "int", nullable: false),
                    ActionByCondition = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ActionByCount = table.Column<int>(type: "int", nullable: false),
                    NextStageCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ShowOnStatusFlag = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ActivityText = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ButtonClass = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true, defaultValue: "primary"),
                    ButtonText = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ButtonTooltip = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TriggerEntityFormSubmit = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_WFStageActions", x => x.ID);
                    table.ForeignKey(
                        name: "FK_WFStageActions_WFStages_WFStageID",
                        column: x => x.WFStageID,
                        principalTable: "WFStages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingAgendas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IsReadOnly = table.Column<bool>(type: "bit", nullable: false),
                    MeetingID = table.Column<int>(type: "int", nullable: false),
                    MeetingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MeetingTitle = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Subtitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActionBy = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ActionByContactID = table.Column<int>(type: "int", nullable: true),
                    PreviousHistory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousDueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PreviousActionBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousComment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PreviousAgendaID = table.Column<int>(type: "int", nullable: true),
                    IsForwarded = table.Column<bool>(type: "bit", nullable: false),
                    ReminderCount = table.Column<int>(type: "int", nullable: false),
                    UpdateFrom = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    IsInspection = table.Column<bool>(type: "bit", nullable: false),
                    NotDiscussed = table.Column<bool>(type: "bit", nullable: false),
                    SendUpdate = table.Column<bool>(type: "bit", nullable: false),
                    Progress = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    PreviousProgress = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    TodoID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_MeetingAgendas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MeetingAgendas_Meetings_MeetingID",
                        column: x => x.MeetingID,
                        principalTable: "Meetings",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingAttendees",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Company = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_MeetingAttendees", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MeetingAttendees_Meetings_MeetingID",
                        column: x => x.MeetingID,
                        principalTable: "Meetings",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectAssociations",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectAssociations", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectAssociations_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectAssociations_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectAttachments_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectInwards",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceivedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
                    ContactID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectInwards", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectInwards_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectInwards_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectNotes",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectNotes", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectNotes_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Todos",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SubTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AssigneeContactID = table.Column<int>(type: "int", nullable: false),
                    AssignerContactID = table.Column<int>(type: "int", nullable: false),
                    MHrAssigned = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    MHrConsumed = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_Todos", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Todos_Contacts_AssigneeContactID",
                        column: x => x.AssigneeContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Todos_Contacts_AssignerContactID",
                        column: x => x.AssignerContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Todos_Projects_ProjectID",
                        column: x => x.ProjectID,
                        principalTable: "Projects",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RequestTicketAssignees",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Company = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RequestTicketID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_RequestTicketAssignees", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RequestTicketAssignees_RequestTickets_RequestTicketID",
                        column: x => x.RequestTicketID,
                        principalTable: "RequestTickets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RequestTicketAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestTicketID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_RequestTicketAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RequestTicketAttachments_RequestTickets_RequestTicketID",
                        column: x => x.RequestTicketID,
                        principalTable: "RequestTickets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Assessments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    TaskTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Points = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    ScoredPoints = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WFTaskID = table.Column<int>(type: "int", nullable: true),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EntityID = table.Column<int>(type: "int", nullable: true),
                    EntityTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                    table.PrimaryKey("PK_Assessments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Assessments_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Assessments_WFTasks_WFTaskID",
                        column: x => x.WFTaskID,
                        principalTable: "WFTasks",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimeEntries",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ContactID = table.Column<int>(type: "int", nullable: false),
                    TaskTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ManHours = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    WFTaskID = table.Column<int>(type: "int", nullable: true),
                    IsPaused = table.Column<bool>(type: "bit", nullable: false),
                    ProjectID = table.Column<int>(type: "int", nullable: true),
                    CompanyID = table.Column<int>(type: "int", nullable: false),
                    ManValue = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    ValueHourRate = table.Column<decimal>(type: "decimal(14,2)", precision: 14, scale: 2, nullable: false),
                    Entity = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EntityID = table.Column<int>(type: "int", nullable: true),
                    EntityTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
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
                    table.PrimaryKey("PK_TimeEntries", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TimeEntries_Contacts_ContactID",
                        column: x => x.ContactID,
                        principalTable: "Contacts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TimeEntries_WFTasks_WFTaskID",
                        column: x => x.WFTaskID,
                        principalTable: "WFTasks",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WFTaskAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WFTaskID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_WFTaskAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_WFTaskAttachments_WFTasks_WFTaskID",
                        column: x => x.WFTaskID,
                        principalTable: "WFTasks",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingAgendaAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MeetingAgendaID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_MeetingAgendaAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MeetingAgendaAttachments_MeetingAgendas_MeetingAgendaID",
                        column: x => x.MeetingAgendaID,
                        principalTable: "MeetingAgendas",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectInwardAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectInwardID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ProjectInwardAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjectInwardAttachments_ProjectInwards_ProjectInwardID",
                        column: x => x.ProjectInwardID,
                        principalTable: "ProjectInwards",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TodoAgendas",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TodoID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_TodoAgendas", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TodoAgendas_Todos_TodoID",
                        column: x => x.TodoID,
                        principalTable: "Todos",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TodoAttachments",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TodoID = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_TodoAttachments", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TodoAttachments_Todos_TodoID",
                        column: x => x.TodoID,
                        principalTable: "Todos",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_ContactID",
                table: "Activities",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_Created",
                table: "Activities",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_CreatedByContactID",
                table: "Activities",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_Entity",
                table: "Activities",
                column: "Entity");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_EntityID",
                table: "Activities",
                column: "EntityID");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_IsDeleted",
                table: "Activities",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_Modified",
                table: "Activities",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_ModifiedByContactID",
                table: "Activities",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_OrderFlag",
                table: "Activities",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_StatusFlag",
                table: "Activities",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_TypeFlag",
                table: "Activities",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_UID",
                table: "Activities",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_Created",
                table: "AppSettingMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_CreatedByContactID",
                table: "AppSettingMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_IsDeleted",
                table: "AppSettingMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_Modified",
                table: "AppSettingMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_ModifiedByContactID",
                table: "AppSettingMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_OrderFlag",
                table: "AppSettingMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_StatusFlag",
                table: "AppSettingMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_TypeFlag",
                table: "AppSettingMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettingMasters_UID",
                table: "AppSettingMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_Category",
                table: "AssessmentMasters",
                column: "Category",
                unique: true,
                filter: "[Category] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_Created",
                table: "AssessmentMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_CreatedByContactID",
                table: "AssessmentMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_IsDeleted",
                table: "AssessmentMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_Modified",
                table: "AssessmentMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_ModifiedByContactID",
                table: "AssessmentMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_OrderFlag",
                table: "AssessmentMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_StatusFlag",
                table: "AssessmentMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_TypeFlag",
                table: "AssessmentMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_AssessmentMasters_UID",
                table: "AssessmentMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_ContactID",
                table: "Assessments",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_Created",
                table: "Assessments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_CreatedByContactID",
                table: "Assessments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_IsDeleted",
                table: "Assessments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_Modified",
                table: "Assessments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_ModifiedByContactID",
                table: "Assessments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_OrderFlag",
                table: "Assessments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_StatusFlag",
                table: "Assessments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_TypeFlag",
                table: "Assessments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_UID",
                table: "Assessments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Assessments_WFTaskID",
                table: "Assessments",
                column: "WFTaskID");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_Created",
                table: "Companies",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_CreatedByContactID",
                table: "Companies",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_IsDeleted",
                table: "Companies",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_Modified",
                table: "Companies",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ModifiedByContactID",
                table: "Companies",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_OrderFlag",
                table: "Companies",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_StatusFlag",
                table: "Companies",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_TypeFlag",
                table: "Companies",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_UID",
                table: "Companies",
                column: "UID");

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
                name: "IX_ContactAppointments_CompanyID",
                table: "ContactAppointments",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_ContactID",
                table: "ContactAppointments",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_Created",
                table: "ContactAppointments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_CreatedByContactID",
                table: "ContactAppointments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_IsDeleted",
                table: "ContactAppointments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_JoiningDate",
                table: "ContactAppointments",
                column: "JoiningDate");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_Modified",
                table: "ContactAppointments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_ModifiedByContactID",
                table: "ContactAppointments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_OrderFlag",
                table: "ContactAppointments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_ResignationDate",
                table: "ContactAppointments",
                column: "ResignationDate");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_StatusFlag",
                table: "ContactAppointments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_TypeFlag",
                table: "ContactAppointments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAppointments_UID",
                table: "ContactAppointments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_CompanyContactID",
                table: "ContactAssociations",
                column: "CompanyContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_Created",
                table: "ContactAssociations",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_CreatedByContactID",
                table: "ContactAssociations",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_IsDeleted",
                table: "ContactAssociations",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_Modified",
                table: "ContactAssociations",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_ModifiedByContactID",
                table: "ContactAssociations",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_OrderFlag",
                table: "ContactAssociations",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_PersonContactID",
                table: "ContactAssociations",
                column: "PersonContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_StatusFlag",
                table: "ContactAssociations",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_TypeFlag",
                table: "ContactAssociations",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAssociations_UID",
                table: "ContactAssociations",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_ContactID",
                table: "ContactAttachments",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_Created",
                table: "ContactAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_CreatedByContactID",
                table: "ContactAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_Filename",
                table: "ContactAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_IsDeleted",
                table: "ContactAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_Modified",
                table: "ContactAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_ModifiedByContactID",
                table: "ContactAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_OrderFlag",
                table: "ContactAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_StatusFlag",
                table: "ContactAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_TypeFlag",
                table: "ContactAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ContactAttachments_UID",
                table: "ContactAttachments",
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
                name: "IX_Contacts_Created",
                table: "Contacts",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_CreatedByContactID",
                table: "Contacts",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_FirstName",
                table: "Contacts",
                column: "FirstName");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_FullName",
                table: "Contacts",
                column: "FullName");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_IsDeleted",
                table: "Contacts",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Modified",
                table: "Contacts",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_ModifiedByContactID",
                table: "Contacts",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_OrderFlag",
                table: "Contacts",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_RelationshipManagerID",
                table: "Contacts",
                column: "RelationshipManagerID");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_StatusFlag",
                table: "Contacts",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_TypeFlag",
                table: "Contacts",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_UID",
                table: "Contacts",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_Username",
                table: "Contacts",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_ContactID",
                table: "LoginSessions",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_Created",
                table: "LoginSessions",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_CreatedByContactID",
                table: "LoginSessions",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_IsActive",
                table: "LoginSessions",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_IsDeleted",
                table: "LoginSessions",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_IsOTPRequired",
                table: "LoginSessions",
                column: "IsOTPRequired");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_IsOTPVerified",
                table: "LoginSessions",
                column: "IsOTPVerified");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_Modified",
                table: "LoginSessions",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_ModifiedByContactID",
                table: "LoginSessions",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_OrderFlag",
                table: "LoginSessions",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_StatusFlag",
                table: "LoginSessions",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_TypeFlag",
                table: "LoginSessions",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_UID",
                table: "LoginSessions",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_LoginSessions_Username",
                table: "LoginSessions",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_Created",
                table: "MeetingAgendaAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_CreatedByContactID",
                table: "MeetingAgendaAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_Filename",
                table: "MeetingAgendaAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_IsDeleted",
                table: "MeetingAgendaAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_MeetingAgendaID",
                table: "MeetingAgendaAttachments",
                column: "MeetingAgendaID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_Modified",
                table: "MeetingAgendaAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_ModifiedByContactID",
                table: "MeetingAgendaAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_OrderFlag",
                table: "MeetingAgendaAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_StatusFlag",
                table: "MeetingAgendaAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_TypeFlag",
                table: "MeetingAgendaAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendaAttachments_UID",
                table: "MeetingAgendaAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_ActionBy",
                table: "MeetingAgendas",
                column: "ActionBy");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_ActionByContactID",
                table: "MeetingAgendas",
                column: "ActionByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_Created",
                table: "MeetingAgendas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_CreatedByContactID",
                table: "MeetingAgendas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_DueDate",
                table: "MeetingAgendas",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_IsDeleted",
                table: "MeetingAgendas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_IsForwarded",
                table: "MeetingAgendas",
                column: "IsForwarded");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_IsInspection",
                table: "MeetingAgendas",
                column: "IsInspection");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_IsReadOnly",
                table: "MeetingAgendas",
                column: "IsReadOnly");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_MeetingDate",
                table: "MeetingAgendas",
                column: "MeetingDate");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_MeetingID",
                table: "MeetingAgendas",
                column: "MeetingID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_MeetingTitle",
                table: "MeetingAgendas",
                column: "MeetingTitle");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_Modified",
                table: "MeetingAgendas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_ModifiedByContactID",
                table: "MeetingAgendas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_NotDiscussed",
                table: "MeetingAgendas",
                column: "NotDiscussed");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_OrderFlag",
                table: "MeetingAgendas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_PreviousAgendaID",
                table: "MeetingAgendas",
                column: "PreviousAgendaID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_ProjectID",
                table: "MeetingAgendas",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_ReminderCount",
                table: "MeetingAgendas",
                column: "ReminderCount");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_SendUpdate",
                table: "MeetingAgendas",
                column: "SendUpdate");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_StatusFlag",
                table: "MeetingAgendas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_Subtitle",
                table: "MeetingAgendas",
                column: "Subtitle");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_Title",
                table: "MeetingAgendas",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_TodoID",
                table: "MeetingAgendas",
                column: "TodoID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_TypeFlag",
                table: "MeetingAgendas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAgendas_UID",
                table: "MeetingAgendas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_Company",
                table: "MeetingAttendees",
                column: "Company");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_ContactID",
                table: "MeetingAttendees",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_Created",
                table: "MeetingAttendees",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_CreatedByContactID",
                table: "MeetingAttendees",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_Email",
                table: "MeetingAttendees",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_IsDeleted",
                table: "MeetingAttendees",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_MeetingID",
                table: "MeetingAttendees",
                column: "MeetingID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_Modified",
                table: "MeetingAttendees",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_ModifiedByContactID",
                table: "MeetingAttendees",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_Name",
                table: "MeetingAttendees",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_OrderFlag",
                table: "MeetingAttendees",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_StatusFlag",
                table: "MeetingAttendees",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_TypeFlag",
                table: "MeetingAttendees",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_UID",
                table: "MeetingAttendees",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_Code",
                table: "Meetings",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_ContactID",
                table: "Meetings",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_Created",
                table: "Meetings",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_CreatedByContactID",
                table: "Meetings",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_EndDate",
                table: "Meetings",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_IsDeleted",
                table: "Meetings",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_IsReadOnly",
                table: "Meetings",
                column: "IsReadOnly");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_Modified",
                table: "Meetings",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_ModifiedByContactID",
                table: "Meetings",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_OrderFlag",
                table: "Meetings",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_ProjectID",
                table: "Meetings",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_StartDate",
                table: "Meetings",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_StatusFlag",
                table: "Meetings",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_Title",
                table: "Meetings",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_TypeFlag",
                table: "Meetings",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Meetings_UID",
                table: "Meetings",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_ContactID",
                table: "ProjectAssociations",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_Created",
                table: "ProjectAssociations",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_CreatedByContactID",
                table: "ProjectAssociations",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_IsDeleted",
                table: "ProjectAssociations",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_Modified",
                table: "ProjectAssociations",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_ModifiedByContactID",
                table: "ProjectAssociations",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_OrderFlag",
                table: "ProjectAssociations",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_ProjectID",
                table: "ProjectAssociations",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_StatusFlag",
                table: "ProjectAssociations",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_TypeFlag",
                table: "ProjectAssociations",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssociations_UID",
                table: "ProjectAssociations",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_Created",
                table: "ProjectAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_CreatedByContactID",
                table: "ProjectAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_Filename",
                table: "ProjectAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_IsDeleted",
                table: "ProjectAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_Modified",
                table: "ProjectAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_ModifiedByContactID",
                table: "ProjectAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_OrderFlag",
                table: "ProjectAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_ProjectID",
                table: "ProjectAttachments",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_StatusFlag",
                table: "ProjectAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_TypeFlag",
                table: "ProjectAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAttachments_UID",
                table: "ProjectAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_Created",
                table: "ProjectInwardAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_CreatedByContactID",
                table: "ProjectInwardAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_Filename",
                table: "ProjectInwardAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_IsDeleted",
                table: "ProjectInwardAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_Modified",
                table: "ProjectInwardAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_ModifiedByContactID",
                table: "ProjectInwardAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_OrderFlag",
                table: "ProjectInwardAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_ProjectInwardID",
                table: "ProjectInwardAttachments",
                column: "ProjectInwardID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_StatusFlag",
                table: "ProjectInwardAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_TypeFlag",
                table: "ProjectInwardAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwardAttachments_UID",
                table: "ProjectInwardAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_ContactID",
                table: "ProjectInwards",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_Created",
                table: "ProjectInwards",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_CreatedByContactID",
                table: "ProjectInwards",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_IsDeleted",
                table: "ProjectInwards",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_Modified",
                table: "ProjectInwards",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_ModifiedByContactID",
                table: "ProjectInwards",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_OrderFlag",
                table: "ProjectInwards",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_ProjectID",
                table: "ProjectInwards",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_ReceivedDate",
                table: "ProjectInwards",
                column: "ReceivedDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_StatusFlag",
                table: "ProjectInwards",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_TypeFlag",
                table: "ProjectInwards",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInwards_UID",
                table: "ProjectInwards",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_Created",
                table: "ProjectNotes",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_CreatedByContactID",
                table: "ProjectNotes",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_IsDeleted",
                table: "ProjectNotes",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_Modified",
                table: "ProjectNotes",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_ModifiedByContactID",
                table: "ProjectNotes",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_OrderFlag",
                table: "ProjectNotes",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_ProjectID",
                table: "ProjectNotes",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_StatusFlag",
                table: "ProjectNotes",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_TypeFlag",
                table: "ProjectNotes",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectNotes_UID",
                table: "ProjectNotes",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_BillingTitle",
                table: "Projects",
                column: "BillingTitle");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ClientContactID",
                table: "Projects",
                column: "ClientContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Code",
                table: "Projects",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CompanyID",
                table: "Projects",
                column: "CompanyID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Created",
                table: "Projects",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_CreatedByContactID",
                table: "Projects",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_IsDeleted",
                table: "Projects",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Location",
                table: "Projects",
                column: "Location");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Modified",
                table: "Projects",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ModifiedByContactID",
                table: "Projects",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_OrderFlag",
                table: "Projects",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ReferredByContactID",
                table: "Projects",
                column: "ReferredByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Segment",
                table: "Projects",
                column: "Segment");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_StatusFlag",
                table: "Projects",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Title",
                table: "Projects",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TypeFlag",
                table: "Projects",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UID",
                table: "Projects",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_CreatedOn",
                table: "RefreshTokens",
                column: "CreatedOn");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserID",
                table: "RefreshTokens",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_ContactID",
                table: "RequestTicketAssignees",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_Created",
                table: "RequestTicketAssignees",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_CreatedByContactID",
                table: "RequestTicketAssignees",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_IsDeleted",
                table: "RequestTicketAssignees",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_Modified",
                table: "RequestTicketAssignees",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_ModifiedByContactID",
                table: "RequestTicketAssignees",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_OrderFlag",
                table: "RequestTicketAssignees",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_RequestTicketID",
                table: "RequestTicketAssignees",
                column: "RequestTicketID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_StatusFlag",
                table: "RequestTicketAssignees",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_TypeFlag",
                table: "RequestTicketAssignees",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAssignees_UID",
                table: "RequestTicketAssignees",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_Created",
                table: "RequestTicketAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_CreatedByContactID",
                table: "RequestTicketAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_Filename",
                table: "RequestTicketAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_IsDeleted",
                table: "RequestTicketAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_Modified",
                table: "RequestTicketAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_ModifiedByContactID",
                table: "RequestTicketAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_OrderFlag",
                table: "RequestTicketAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_RequestTicketID",
                table: "RequestTicketAttachments",
                column: "RequestTicketID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_StatusFlag",
                table: "RequestTicketAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_TypeFlag",
                table: "RequestTicketAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTicketAttachments_UID",
                table: "RequestTicketAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_AssignerContactID",
                table: "RequestTickets",
                column: "AssignerContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Code",
                table: "RequestTickets",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Created",
                table: "RequestTickets",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_CreatedByContactID",
                table: "RequestTickets",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Entity",
                table: "RequestTickets",
                column: "Entity");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_EntityID",
                table: "RequestTickets",
                column: "EntityID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_IsDeleted",
                table: "RequestTickets",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_IsReadOnly",
                table: "RequestTickets",
                column: "IsReadOnly");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Modified",
                table: "RequestTickets",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_ModifiedByContactID",
                table: "RequestTickets",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_NextReminderDate",
                table: "RequestTickets",
                column: "NextReminderDate");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_OrderFlag",
                table: "RequestTickets",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_ParentID",
                table: "RequestTickets",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_ProjectID",
                table: "RequestTickets",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Purpose",
                table: "RequestTickets",
                column: "Purpose");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_StatusFlag",
                table: "RequestTickets",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Subtitle",
                table: "RequestTickets",
                column: "Subtitle");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_Title",
                table: "RequestTickets",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_TypeFlag",
                table: "RequestTickets",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_RequestTickets_UID",
                table: "RequestTickets",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_Created",
                table: "StatusMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_CreatedByContactID",
                table: "StatusMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_IsDeleted",
                table: "StatusMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_Modified",
                table: "StatusMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_ModifiedByContactID",
                table: "StatusMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_OrderFlag",
                table: "StatusMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_StatusFlag",
                table: "StatusMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_TypeFlag",
                table: "StatusMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_StatusMasters_UID",
                table: "StatusMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_ContactID",
                table: "TimeEntries",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_Created",
                table: "TimeEntries",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_CreatedByContactID",
                table: "TimeEntries",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_IsDeleted",
                table: "TimeEntries",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_Modified",
                table: "TimeEntries",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_ModifiedByContactID",
                table: "TimeEntries",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_OrderFlag",
                table: "TimeEntries",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_StatusFlag",
                table: "TimeEntries",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_TypeFlag",
                table: "TimeEntries",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_UID",
                table: "TimeEntries",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_TimeEntries_WFTaskID",
                table: "TimeEntries",
                column: "WFTaskID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_Created",
                table: "TodoAgendas",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_CreatedByContactID",
                table: "TodoAgendas",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_IsDeleted",
                table: "TodoAgendas",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_Modified",
                table: "TodoAgendas",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_ModifiedByContactID",
                table: "TodoAgendas",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_OrderFlag",
                table: "TodoAgendas",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_StatusFlag",
                table: "TodoAgendas",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_TodoID",
                table: "TodoAgendas",
                column: "TodoID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_TypeFlag",
                table: "TodoAgendas",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAgendas_UID",
                table: "TodoAgendas",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_Created",
                table: "TodoAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_CreatedByContactID",
                table: "TodoAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_Filename",
                table: "TodoAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_IsDeleted",
                table: "TodoAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_Modified",
                table: "TodoAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_ModifiedByContactID",
                table: "TodoAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_OrderFlag",
                table: "TodoAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_StatusFlag",
                table: "TodoAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_TodoID",
                table: "TodoAttachments",
                column: "TodoID");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_TypeFlag",
                table: "TodoAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TodoAttachments_UID",
                table: "TodoAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_AssigneeContactID",
                table: "Todos",
                column: "AssigneeContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_AssignerContactID",
                table: "Todos",
                column: "AssignerContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_Created",
                table: "Todos",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_CreatedByContactID",
                table: "Todos",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_DueDate",
                table: "Todos",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_IsDeleted",
                table: "Todos",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_Modified",
                table: "Todos",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ModifiedByContactID",
                table: "Todos",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_OrderFlag",
                table: "Todos",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_ProjectID",
                table: "Todos",
                column: "ProjectID");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_StatusFlag",
                table: "Todos",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_TypeFlag",
                table: "Todos",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_Todos_UID",
                table: "Todos",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_Created",
                table: "TypeMasters",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_CreatedByContactID",
                table: "TypeMasters",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_IsDeleted",
                table: "TypeMasters",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_Modified",
                table: "TypeMasters",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_ModifiedByContactID",
                table: "TypeMasters",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_OrderFlag",
                table: "TypeMasters",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_StatusFlag",
                table: "TypeMasters",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_TypeFlag",
                table: "TypeMasters",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_TypeMasters_UID",
                table: "TypeMasters",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_Created",
                table: "WFStageActions",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_CreatedByContactID",
                table: "WFStageActions",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_IsDeleted",
                table: "WFStageActions",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_Modified",
                table: "WFStageActions",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_ModifiedByContactID",
                table: "WFStageActions",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_OrderFlag",
                table: "WFStageActions",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_StatusFlag",
                table: "WFStageActions",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_TypeFlag",
                table: "WFStageActions",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_UID",
                table: "WFStageActions",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WFStageActions_WFStageID",
                table: "WFStageActions",
                column: "WFStageID");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_ActionType",
                table: "WFStages",
                column: "ActionType");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_AssessmentForStage",
                table: "WFStages",
                column: "AssessmentForStage");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_Code",
                table: "WFStages",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_Created",
                table: "WFStages",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_CreatedByContactID",
                table: "WFStages",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_Entity",
                table: "WFStages",
                column: "Entity");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_EntityTypeFlag",
                table: "WFStages",
                column: "EntityTypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_InitialRevison",
                table: "WFStages",
                column: "InitialRevison");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_IsAssessmentRequired",
                table: "WFStages",
                column: "IsAssessmentRequired");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_IsAssignByRole",
                table: "WFStages",
                column: "IsAssignByRole");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_IsDeleted",
                table: "WFStages",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_IsStart",
                table: "WFStages",
                column: "IsStart");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_IsSystem",
                table: "WFStages",
                column: "IsSystem");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_Modified",
                table: "WFStages",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_ModifiedByContactID",
                table: "WFStages",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_OrderFlag",
                table: "WFStages",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_ShowAssessment",
                table: "WFStages",
                column: "ShowAssessment");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_StatusFlag",
                table: "WFStages",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_TaskTitle",
                table: "WFStages",
                column: "TaskTitle");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_TypeFlag",
                table: "WFStages",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFStages_UID",
                table: "WFStages",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_Created",
                table: "WFTaskAttachments",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_CreatedByContactID",
                table: "WFTaskAttachments",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_Filename",
                table: "WFTaskAttachments",
                column: "Filename");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_IsDeleted",
                table: "WFTaskAttachments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_Modified",
                table: "WFTaskAttachments",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_ModifiedByContactID",
                table: "WFTaskAttachments",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_OrderFlag",
                table: "WFTaskAttachments",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_StatusFlag",
                table: "WFTaskAttachments",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_TypeFlag",
                table: "WFTaskAttachments",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_UID",
                table: "WFTaskAttachments",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTaskAttachments_WFTaskID",
                table: "WFTaskAttachments",
                column: "WFTaskID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_AssignerContactID",
                table: "WFTasks",
                column: "AssignerContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_CompletedDate",
                table: "WFTasks",
                column: "CompletedDate");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_ContactID",
                table: "WFTasks",
                column: "ContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_Created",
                table: "WFTasks",
                column: "Created");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_CreatedByContactID",
                table: "WFTasks",
                column: "CreatedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_DueDate",
                table: "WFTasks",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_Entity",
                table: "WFTasks",
                column: "Entity");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_EntityID",
                table: "WFTasks",
                column: "EntityID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_FollowUpDate",
                table: "WFTasks",
                column: "FollowUpDate");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_IsAssessmentRequired",
                table: "WFTasks",
                column: "IsAssessmentRequired");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_IsDeleted",
                table: "WFTasks",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_IsPreAssignedTimeTask",
                table: "WFTasks",
                column: "IsPreAssignedTimeTask");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_Modified",
                table: "WFTasks",
                column: "Modified");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_ModifiedByContactID",
                table: "WFTasks",
                column: "ModifiedByContactID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_OrderFlag",
                table: "WFTasks",
                column: "OrderFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_OutcomeFlag",
                table: "WFTasks",
                column: "OutcomeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_StageRevision",
                table: "WFTasks",
                column: "StageRevision");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_StartDate",
                table: "WFTasks",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_StatusFlag",
                table: "WFTasks",
                column: "StatusFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_TypeFlag",
                table: "WFTasks",
                column: "TypeFlag");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_UID",
                table: "WFTasks",
                column: "UID");

            migrationBuilder.CreateIndex(
                name: "IX_WFTasks_WFStageCode",
                table: "WFTasks",
                column: "WFStageCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropTable(
                name: "AppSettingMasters");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AssessmentMasters");

            migrationBuilder.DropTable(
                name: "Assessments");

            migrationBuilder.DropTable(
                name: "ContactAddresses");

            migrationBuilder.DropTable(
                name: "ContactAppointments");

            migrationBuilder.DropTable(
                name: "ContactAssociations");

            migrationBuilder.DropTable(
                name: "ContactAttachments");

            migrationBuilder.DropTable(
                name: "ContactEmails");

            migrationBuilder.DropTable(
                name: "ContactNotes");

            migrationBuilder.DropTable(
                name: "ContactPhones");

            migrationBuilder.DropTable(
                name: "LoginSessions");

            migrationBuilder.DropTable(
                name: "MeetingAgendaAttachments");

            migrationBuilder.DropTable(
                name: "MeetingAttendees");

            migrationBuilder.DropTable(
                name: "ProjectAssociations");

            migrationBuilder.DropTable(
                name: "ProjectAttachments");

            migrationBuilder.DropTable(
                name: "ProjectInwardAttachments");

            migrationBuilder.DropTable(
                name: "ProjectNotes");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "RequestTicketAssignees");

            migrationBuilder.DropTable(
                name: "RequestTicketAttachments");

            migrationBuilder.DropTable(
                name: "StatusMasters");

            migrationBuilder.DropTable(
                name: "TimeEntries");

            migrationBuilder.DropTable(
                name: "TodoAgendas");

            migrationBuilder.DropTable(
                name: "TodoAttachments");

            migrationBuilder.DropTable(
                name: "TypeMasters");

            migrationBuilder.DropTable(
                name: "WFStageActions");

            migrationBuilder.DropTable(
                name: "WFTaskAttachments");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "MeetingAgendas");

            migrationBuilder.DropTable(
                name: "ProjectInwards");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "RequestTickets");

            migrationBuilder.DropTable(
                name: "Todos");

            migrationBuilder.DropTable(
                name: "WFStages");

            migrationBuilder.DropTable(
                name: "WFTasks");

            migrationBuilder.DropTable(
                name: "Meetings");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Contacts");
        }
    }
}
