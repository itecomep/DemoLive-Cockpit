
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using MyCockpitView.WebApi.ActivityModule;

using MyCockpitView.WebApi.AppSettingMasterModule;
using MyCockpitView.WebApi.AssetModule.Extensions;
using MyCockpitView.WebApi.AuthModule;
using MyCockpitView.WebApi.AuthModule.Extensions;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Extensions;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Extensions;
using MyCockpitView.WebApi.ImageLibraryModule;
using MyCockpitView.WebApi.LeaveModule.Extensions;
using MyCockpitView.WebApi.MeetingModule.Extensions;
using MyCockpitView.WebApi.Middleware;
using MyCockpitView.WebApi.PackageModule.Extensions;
using MyCockpitView.WebApi.ProjectModule.Extensions;
using MyCockpitView.WebApi.RequestTicketModule.Extensions;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Settings;
using MyCockpitView.WebApi.SiteVisitModule.Extensions;
using MyCockpitView.WebApi.StatusMasterModule;
using MyCockpitView.WebApi.TodoModule.Extensions;
using MyCockpitView.WebApi.TypeMasterModule;
using MyCockpitView.WebApi.WFTaskModule.Extensions;
using MyCockpitView.WebApi.WorkOrderModule.Extensions;
using MyCockpitView.WebApi.GmailModule.Extensions;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.GmailModule.Configuration;
using Microsoft.AspNetCore.Http.Features;
using MyCockpitView.WebApi.NotificationModule;
using MyCockpitView.WebApi.NotificationModule.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

//EF context
var sqlServerDbSettings = builder.Configuration.GetSection(nameof(SqlServerDbSettings)).Get<SqlServerDbSettings>();
builder.Services.AddSqlServerDb(sqlServerDbSettings);

// **New Gmail DB**
builder.Services.AddDbContext<MyCockpitView.WebApi.GmailModule.Data.GmailEmailContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("GmailDbConnection")));

//JWT bearer
var jwtSettings = builder.Configuration.GetSection(nameof(JwtSettings)).Get<JwtSettings>();
// var jwtSettings = new JwtSettings();
// builder.Configuration.Bind(nameof(JwtSettings), jwtSettings);
builder.Services.AddSingleton(jwtSettings);
builder.Services.AddJwtBearerAuthentication(jwtSettings);

builder.Services.AddHttpContextAccessor();

//Shared Services
builder.Services.AddScoped<IAzureBlobService, AzureBlobService>();
builder.Services.AddScoped<ISharedService, SharedService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped(typeof(IBaseEntityService<>), typeof(BaseEntityService<>));
builder.Services.AddScoped(typeof(IBaseAttachmentService<>), typeof(BaseAttachmentService<>));
//builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
//Module Services
builder.Services.RegisterActivityServices();
builder.Services.RegisterAppSettingMasterServices();
builder.Services.RegisterAuthServices();
builder.Services.RegisterAssetServices();
builder.Services.RegisterCompanyServices();
builder.Services.RegisterContactServices();
builder.Services.RegisterStatusMasterServices();
builder.Services.RegisterTypeMasterServices();
builder.Services.RegisterProjectServices();
builder.Services.RegisterWFTaskServices();
builder.Services.RegisterTodoServices();
builder.Services.RegisterImageLibraryEntityServices();
builder.Services.RegisterMeetingServices();
builder.Services.RegisterRequestTicketServices();
builder.Services.RegisterPackageServices();
builder.Services.RegisterLeaveServices();
builder.Services.RegisterSiteVisitServices();
builder.Services.RegisterWorkOrderServices();
builder.Services.RegisterGmailServices();

builder.Services.Configure<GmailOAuthSettings>(builder.Configuration.GetSection("GmailOAuth"));
builder.Services.Configure<ssoSettings>(builder.Configuration.GetSection("SSO"));

//autoMapper
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.ConfigureCors();

builder.Services.AddControllers()
    .AddJsonOptions(x =>{
    x.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
    c.EnableAnnotations();

    c.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme (Example: 'Bearer 12345abcdef')",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = JwtBearerDefaults.AuthenticationScheme
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200", "https://myecomep.com", "https://myecomep.com/staging")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddHealthChecks();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1L * 1024 * 1024 * 1024; // 1GB
});

// 1GB Kestrel limit
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1L * 1024 * 1024 * 1024;
});

// ================= SIGNALR =================
builder.Services.AddSignalR();

// ================= Notification =================
builder.Services.AddScoped<BirthdayNotificationService>();
builder.Services.AddHostedService<BirthdayBackgroundService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//if (app.Environment.IsDevelopment())
//{
//    app.UseDeveloperExceptionPage();
//}

//Exceptions
app.AddGlobalErrorHandler();


//not required in Kubernetes
// app.UseHttpsRedirection();

app.MapHealthChecks("/health");

app.UseCors("CorsPolicy");

app.UseStaticFiles();

app.UseAuthentication();

app.UseAuthorization();

// Add username context middleware after auth
app.UseMiddleware<UserContextMiddleware>();
app.UseMiddleware<OutsideIpAccessMiddleware>();

app.MapHub<NotificationHub>("/notificationHub");

app.MapControllers();

app.MigrateDatabase();

app.Run();
