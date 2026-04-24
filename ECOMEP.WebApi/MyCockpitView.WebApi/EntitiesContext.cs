using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ActivityModule.Entities;
using MyCockpitView.WebApi.AppSettingMasterModule;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.GmailModule.Configurations;
using MyCockpitView.WebApi.HrModule.Entities;
using MyCockpitView.WebApi.ImageLibraryModule.Entities;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.NotificationModule.Entities;
using MyCockpitView.WebApi.PackageModule.Entities;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.RequestTicketModule.Entities;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.SiteVisitModule.Entities;
using MyCockpitView.WebApi.StatusMasterModule;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.TypeMasterModule;
using MyCockpitView.WebApi.WebPushSubscriptionModule;
using MyCockpitView.WebApi.WFTaskModule.Entities;
using MyCockpitView.WebApi.WorkOrderModule.Entities;
using MyCockpitView.WebApi.NotificationModule.Entities;

namespace MyCockpitView.WebApi;


public class EntitiesContext : IdentityDbContext<User, Role, Guid, IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>
{
    private readonly ICurrentUserService? _currentUserService;
    private readonly ILogger<EntitiesContext>? _logger;

    // Constructor for EF Core internal use (migrations, etc)
    protected EntitiesContext(DbContextOptions<EntitiesContext> opt) : base(opt)
    { }

    // Main constructor for application use
    public EntitiesContext(
        DbContextOptions<EntitiesContext> opt, 
        ICurrentUserService currentUserService,
        ILogger<EntitiesContext>? logger = null)
        : base(opt)
    {
        _currentUserService = currentUserService;
        _logger = logger;
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        //Custom functions for Querying
        modelBuilder.AddCustomFunctions();


        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
        modelBuilder.ApplyConfiguration(new AppSettingMasterConfiguration());
        modelBuilder.ApplyConfiguration(new CompanyConfiguration());
        modelBuilder.ApplyConfiguration(new StatusMasterConfiguration());
        modelBuilder.ApplyConfiguration(new TypeMasterConfiguration());
        modelBuilder.ApplyConfiguration(new ActivityConfiguration());
        modelBuilder.ApplyConfiguration(new ActivityAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new AllowedIpAddressConfiguration());

        //Auth
        modelBuilder.ApplyConfiguration(new LoginSessionConfiguration());
        modelBuilder.ApplyConfiguration(new PermissionGroupConfiguration());
        modelBuilder.ApplyConfiguration(new UserPermissionGroupMapConfiguration());

        //Company
        modelBuilder.ApplyConfiguration(new CompanyConfiguration());

        //Assets
        modelBuilder.ApplyConfiguration(new AssetConfiguration());
        modelBuilder.ApplyConfiguration(new AssetAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new AssetAttributeConfiguration());
        modelBuilder.ApplyConfiguration(new AssetAttributeMasterConfiguration());
        modelBuilder.ApplyConfiguration(new AssetScheduleConfiguration());
        modelBuilder.ApplyConfiguration(new AssetScheduleAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new AssetVendorConfiguration());
        modelBuilder.ApplyConfiguration(new AssetScheduleComponentConfiguration());
        modelBuilder.ApplyConfiguration(new AssetLinkConfiguration());

        //Contacts
        modelBuilder.ApplyConfiguration(new ContactConfiguration());
        modelBuilder.ApplyConfiguration(new ContactAssociationConfiguration());
        modelBuilder.ApplyConfiguration(new ContactAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new ContactAppointmentConfiguration());
        modelBuilder.ApplyConfiguration(new ContactAppointmentAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new ContactTeamConfiguration());
        modelBuilder.ApplyConfiguration(new ContactTeamMemberConfiguration());
        modelBuilder.ApplyConfiguration(new ContactWorkOrderConfiguration());
        modelBuilder.ApplyConfiguration(new ContactWorkOrderAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new ContactWorkOrderPaymentConfiguration());
        modelBuilder.ApplyConfiguration(new ContactWorkOrderPaymentAttachmentConfiguration());

        //Projects
        modelBuilder.ApplyConfiguration(new ProjectConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectAssociationConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectInwardConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectInwardAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectNoteConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectAreaConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectAreaStageConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectStagMasterDeliveryConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectStageMasterConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectAreaStageDeliveryConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectStageConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectStageDeliveryConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectBillConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectBillPaymentConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectBillPaymentAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectWorkOrderConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectWorkOrderAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectWorkOrderAreaConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectWorkOrderMasterConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectWorkOrderSegmentConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectWorkOrderSegmentMasterConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectTeamConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectWorkOrderServiceAmountConfiguration());

        //Todo
        modelBuilder.ApplyConfiguration(new TodoConfiguration());
        modelBuilder.ApplyConfiguration(new TodoAgendaConfiguration());
        modelBuilder.ApplyConfiguration(new TodoAttachmentConfiguration());

        //WFTask
        modelBuilder.ApplyConfiguration(new WFTaskConfiguration());
        modelBuilder.ApplyConfiguration(new WFTaskAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new TimeEntryConfiguration());
        modelBuilder.ApplyConfiguration(new AssessmentConfiguration());
        modelBuilder.ApplyConfiguration(new AssessmentMasterConfiguration());
        modelBuilder.ApplyConfiguration(new WFStageConfiguration());
        modelBuilder.ApplyConfiguration(new WFStageActionConfiguration());

        //Leave
        modelBuilder.ApplyConfiguration(new LeaveConfiguration());
        modelBuilder.ApplyConfiguration(new HolidayMasterConfiguration());
        modelBuilder.ApplyConfiguration(new LeaveAttachmentConfiguration());

        //ImageLibraryEntity
        modelBuilder.ApplyConfiguration(new ImageLibraryEntityConfiguration());

        //Meeting
        modelBuilder.ApplyConfiguration(new MeetingConfiguration());
        modelBuilder.ApplyConfiguration(new MeetingAttendeeConfiguration());
        modelBuilder.ApplyConfiguration(new MeetingAgendaConfiguration());
        modelBuilder.ApplyConfiguration(new MeetingAgendaAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new MeetingAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new MeetingVoucherConfiguration());
        modelBuilder.ApplyConfiguration(new MeetingVoucherAttachmentConfiguration());

        //SiteVisit
        modelBuilder.ApplyConfiguration(new SiteVisitConfiguration());
        modelBuilder.ApplyConfiguration(new SiteVisitAttendeeConfiguration());
        modelBuilder.ApplyConfiguration(new SiteVisitAgendaConfiguration());
        modelBuilder.ApplyConfiguration(new SiteVisitAgendaAttachmentConfiguration());

        //RequestTicket
        modelBuilder.ApplyConfiguration(new RequestTicketConfiguration());
        modelBuilder.ApplyConfiguration(new RequestTicketAssigneeConfiguration());
        modelBuilder.ApplyConfiguration(new RequestTicketAttachmentConfiguration());

        //WebPushSubscription
        modelBuilder.ApplyConfiguration(new WebPushSubscriptionConfiguration());

        //Package
        modelBuilder.ApplyConfiguration(new PackageConfiguration());
        modelBuilder.ApplyConfiguration(new PackageContactConfiguration());
        modelBuilder.ApplyConfiguration(new PackageAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new PackageStudioWorkConfiguration());
        modelBuilder.ApplyConfiguration(new PackageStudioWorkAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new BypassAllowedUserConfiguration());
        modelBuilder.ApplyConfiguration(new GmailTokenConfiguration());

        //WorkOrder
        modelBuilder.ApplyConfiguration(new WorkOrderConfiguration());
        modelBuilder.ApplyConfiguration(new WorkOrderAttachmentConfiguration());
        modelBuilder.ApplyConfiguration(new WorkOrderMasterConfiguration());
        modelBuilder.ApplyConfiguration(new WorkOrderMasterStageConfiguration());
        modelBuilder.ApplyConfiguration(new WorkOrderStageConfiguration());

        // Apply precision to all decimal properties
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var decimalProperties = entityType.GetProperties()
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?));

            foreach (var property in decimalProperties)
            {
                // Apply precision and scale directly to the model
                modelBuilder.Entity(entityType.ClrType)
                    .Property(property.Name)
                    .HasPrecision(18, 2); // Precision and scale
            }
        }

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProjectFiles>()
                .HasMany(pf => pf.Tags)
                .WithOne(t => t.ProjectFile)
                .HasForeignKey(t => t.ProjectFileID)
                .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TodoStage>()
                .HasMany(x => x.Categories)
                .WithOne(x => x.Stage)
                .HasForeignKey(x => x.StageID);

        modelBuilder.Entity<TodoStageCategory>()
            .HasMany(x => x.Checklists)
            .WithOne(x => x.Category)
            .HasForeignKey(x => x.CategoryID);

        modelBuilder.Entity<TodoStage>().ToTable("TodoStage");
        modelBuilder.Entity<TodoStageCategory>().ToTable("TodoStageCategory");
        modelBuilder.Entity<TodoStageChecklist>().ToTable("TodoStageChecklist");

        modelBuilder.Entity<DmsSubClassificationMaster>()
            .HasOne(x => x.Classification)
            .WithMany(x => x.SubClassifications)
            .HasForeignKey(x => x.ClassificationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<DmsSubSubClassificationMaster>()
            .HasOne(x => x.SubClassification)
            .WithMany(x => x.SubSubClassifications)
            .HasForeignKey(x => x.SubClassificationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectFileDeny>()
            .HasOne(d => d.File)
            .WithMany(f => f.DeniedUsers)
            .HasForeignKey(d => d.FileId);

        modelBuilder.Entity<ProjectFolderDeny>()
            .HasOne(d => d.Folder)
            .WithMany(f => f.DeniedUsers)
            .HasForeignKey(d => d.FolderId);
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<PermissionGroup> PermissionGroups { get; set; }

    public DbSet<UserPermissionGroupMap> UserPermissionGroupMaps { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<ActivityAttachment> ActivityAttachments { get; set; }
    public DbSet<AppSettingMaster> AppSettingMasters { get; set; }
    public DbSet<StatusMaster> StatusMasters { get; set; }
    public DbSet<TypeMaster> TypeMasters { get; set; }
    public DbSet<Company> Companies { get; set; }

    //Auth
    public DbSet<LoginSession> LoginSessions { get; set; }
    public DbSet<AllowedIpAddress> AllowedIpAddresses { get; set; }
    public DbSet<BypassAllowedUser> BypassAllowedUsers { get; set; } 


    //Assets
    public DbSet<Asset> Assets { get; set; }
    public DbSet<AssetAttribute> AssetAttributes { get; set; }
    public DbSet<AssetAttachment> AssetAttachments { get; set; }
    public DbSet<AssetAttributeMaster> AssetAttributeMasters { get; set; }
    public DbSet<AssetLink> AssetLinks { get; set; }
    public DbSet<AssetVendor> AssetVendors { get; set; }
    public DbSet<AssetSchedule> AssetSchedules { get; set; }
    public DbSet<AssetScheduleComponent> AssetScheduleComponents { get; set; }
    public DbSet<AssetScheduleAttachment> AssetScheduleAttachments { get; set; }


    //Contacts
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<ContactAssociation> ContactAssociations { get; set; }
    public DbSet<ContactAttachment> ContactAttachments { get; set; }
    public DbSet<ContactAppointment> ContactAppointments { get; set; }
    public DbSet<ContactAppointmentAttachment> ContactAppointmentAttachments { get; set; }
    public DbSet<ContactTeam> ContactTeams { get; set; }
    public DbSet<ContactTeamMember> ContactTeamMembers { get; set; }
    public DbSet<ContactWorkOrder> ContactWorkOrders { get; set; }
    public DbSet<ContactWorkOrderAttachment> ContactWorkOrderAttachments { get; set; }
    public DbSet<ContactWorkOrderPayment> ContactWorkOrderPayments { get; set; }
    public DbSet<ContactWorkOrderPaymentAttachment> ContactWorkOrderPaymentAttachments { get; set; }

    //Projects
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectAssociation> ProjectAssociations { get; set; }
    public DbSet<ProjectAttachment> ProjectAttachments { get; set; }
    public DbSet<ProjectInward> ProjectInwards { get; set; }
    public DbSet<ProjectNote> ProjectNotes { get; set; }
    public DbSet<ProjectInwardAttachment> ProjectInwardAttachments { get; set; }
    public DbSet<ProjectArea> ProjectAreas { get; set; }
    public DbSet<ProjectAreaStage> ProjectAreaStages { get; set; }
    public DbSet<ProjectStageMaster> ProjectStageMasters { get; set; }
    public DbSet<ProjectStageMasterDelivery> ProjectStageMasterDeliveries { get; set; }
    public DbSet<ProjectAreaStageDelivery> ProjectAreaStageDeliveries { get; set; }
    public DbSet<ProjectStage> ProjectStages { get; set; }
    public DbSet<ProjectStageDelivery> ProjectStageDeliveries { get; set; }
    public DbSet<ProjectBill> ProjectBills { get; set; }
    public DbSet<ProjectBillPayment> ProjectBillPayments { get; set; }
    public DbSet<ProjectBillPaymentAttachment> ProjectBillPaymentAttachments { get; set; }
    public DbSet<ProjectWorkOrder> ProjectWorkOrders { get; set; }
    public DbSet<ProjectWorkOrderArea> ProjectWorkOrderAreas { get; set; }
    public DbSet<ProjectWorkOrderAttachment> ProjectWorkOrderAttachements { get; set; }
    public DbSet<ProjectWorkOrderMaster> ProjectWorkOrderMasters { get; set; }
    public DbSet<ProjectWorkOrderSegment> ProjectWorkOrderSegments { get; set; }
    public DbSet<ProjectWorkOrderSegmentMaster> ProjectWorkOrderSegmentMasters { get; set; }
    public DbSet<ProjectTeam> ProjectTeams { get; set; }
    public DbSet<ProjectWorkOrderServiceAmount> ProjectWorkOrderServiceAmounts { get; set; }

    //Todo
    public DbSet<Todo> Todos { get; set; }
    public DbSet<TodoAttachment> TodoAttachments { get; set; }
    public DbSet<TodoAgenda> TodoAgendas { get; set; }

    //WFTask
    public DbSet<WFTaskAttachment> WFTaskAttachments { get; set; }
    public DbSet<WFStage> WFStages { get; set; }
    public DbSet<WFStageAction> WFStageActions { get; set; }
    public DbSet<WFTask> WFTasks { get; set; }
    public DbSet<AssessmentMaster> AssessmentMasters { get; set; }
    public DbSet<Assessment> Assessments { get; set; }
    public DbSet<TimeEntry> TimeEntries { get; set; }

    //Leave
    public DbSet<Leave> Leaves { get; set; }
    public DbSet<HolidayMaster> HolidayMasters { get; set; }

    //ImageLibaryEntity
    public DbSet<ImageLibraryEntity> ImageLibraryEntities { get; set; }

    //Meeting
    public DbSet<Meeting> Meetings { get; set; }
    public DbSet<MeetingAttendee> MeetingAttendees { get; set; }
    public DbSet<MeetingAgenda> MeetingAgendas { get; set; }
    public DbSet<MeetingAgendaAttachment> MeetingAgendaAttachments { get; set; }
    public DbSet<MeetingAttachment> MeetingAttachments { get; set; }
    public DbSet<MeetingVoucher> MeetingVouchers { get; set; }
    public DbSet<MeetingVoucherAttachment> MeetingVoucherAttachments { get; set; }

    //SiteVisit
    public DbSet<SiteVisit> SiteVisits { get; set; }
    public DbSet<SiteVisitAttendee> SiteVisitAttendees { get; set; }
    public DbSet<SiteVisitAgenda> SiteVisitAgendas { get; set; }
    public DbSet<SiteVisitAgendaAttachment> SiteVisitAgendaAttachments { get; set; }

    //RequestTicket
    public DbSet<RequestTicket> RequestTickets { get; set; }
    public DbSet<RequestTicketAssignee> RequestTicketAssignees { get; set; }
    public DbSet<RequestTicketAttachment> RequestTicketAttachments { get; set; }

    //WebPushSubscription
    public DbSet<WebPushSubscription> WebPushSubscriptions { get; set; }

    //Package
    public DbSet<Package> Packages { get; set; }
    public DbSet<PackageContact> PackageContacts { get; set; }
    public DbSet<PackageAttachment> PackageAttachments { get; set; }
    public DbSet<PackageStudioWork> PackageStudioWorks { get; set; }
    public DbSet<PackageStudioWorkAttachment> PackageStudioWorkAttachments { get; set; }

    //WorkOrder
    public DbSet<WorkOrder> WorkOrders{ get; set; }
    public DbSet<WorkOrderAttachment> WorkOrderAttachments { get; set; }
    public DbSet<WorkOrderMaster> WorkOrderMasters{ get; set; }
    public DbSet<WorkOrderMasterStage> WorkOrderMasterStages { get; set; }
    public DbSet<WorkOrderStage> WorkOrderStages { get; set; }

    //Gmail Module
    public DbSet<GmailToken> GmailTokens { get; set; }
    public DbSet<ProjectFiles> ProjectFiles { get; set; }
    public DbSet<DmsClassificationMaster> DmsClassificationMasters { get; set; }
    public DbSet<DmsSubClassificationMaster> DmsSubClassificationMasters { get; set; }
    public DbSet<DmsSubSubClassificationMaster> DmsSubSubClassificationMasters { get; set; }
    public DbSet<ProjectFileTag> ProjectFileTags { get; set; }
    public DbSet<ProjectFolder> ProjectFolders { get; set; }
    public DbSet<ProjectSubFolderDMSFile> ProjectSubFolderDMSFile { get; set; }
    public DbSet<ProjectFileDeny> ProjectFileDenies { get; set; }
    public DbSet<ProjectFolderDeny> ProjectFolderDenies { get; set; }

    public DbSet<TodoStage> TodoStages { get; set; }
    public DbSet<TodoStageCategory> TodoStageCategories { get; set; }
    public DbSet<TodoStageChecklist> TodoStageChecklists { get; set; }
    public DbSet<BillFollowUp> BillFollowUps { get; set; }
    public DbSet<WorkFromHomeRequest> WorkFromHomeRequests { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<ProjectTarget> ProjectTargets { get; set; }
    public DbSet<ProjectTargetHistory> ProjectTargetHistories { get; set; }
    // END

    private IDbContextTransaction _transaction;

    public async Task BeginTransactionAsync()
    {
        _transaction = await Database.BeginTransactionAsync();
    }

    public async Task CommitAsync()
    {
        try
        {
            await SaveChangesAsync();
            await _transaction.CommitAsync();
        }
        finally
        {
            await _transaction.DisposeAsync();
        }
    }

    public async Task RollbackAsync()
    {
        await _transaction.RollbackAsync();
        await _transaction.DisposeAsync();
    }

public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        try 
        {
            if (ChangeTracker?.Entries()?.Any(x => x.Entity is BaseEntity) == true)
            {
                // First try to get cached username
                string? currentUsername = _currentUserService?.GetCachedUsername();
                
                // Fallback to getting from claims if not cached
                if (string.IsNullOrEmpty(currentUsername))
                {
                    try 
                    {
                        currentUsername = _currentUserService?.GetCurrentUsername();
                        if (!string.IsNullOrEmpty(currentUsername))
                        {
                            _currentUserService?.SetCachedUsername(currentUsername);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogWarning(ex, "Failed to get current username. Changes will be tracked as 'System'.");
                    }
                }

                if (string.IsNullOrEmpty(currentUsername))
                {
                    _logger?.LogWarning("No current user found when saving changes. Changes will be tracked as 'System'.");
                }

                Contact? contact = null;
                if (!string.IsNullOrEmpty(currentUsername))
                {
                    // Use NoTracking to avoid circular tracking issues
                    contact = await Contacts
                        .AsNoTracking()
                        .FirstOrDefaultAsync(x => x.Username == currentUsername, cancellationToken);
                    
                    if (contact == null)
                    {
                        _logger?.LogWarning("No contact found for username {Username}. Changes will be tracked as 'System'.", currentUsername);
                    }
                }
                
                string contactName = contact?.Name ?? "System";
                int? contactId = contact?.ID;

                var entities = ChangeTracker.Entries()
                    .Where(x => x.Entity is BaseEntity && 
                        (x.State == EntityState.Added || x.State == EntityState.Modified));

                foreach (var entity in entities)
                {
                    var baseEntity = (BaseEntity)entity.Entity;
                    var entityType = entity.Entity.GetType().Name;

                    if (entity.State == EntityState.Added)
                    {
                        baseEntity.Created = DateTime.UtcNow;
                        baseEntity.CreatedBy = contactName;
                        baseEntity.CreatedByContactID = contactId;
                        _logger?.LogInformation("Creating new {EntityType} by user {UserName}", entityType, contactName);
                    }

                    baseEntity.Modified = DateTime.UtcNow;
                    baseEntity.ModifiedBy = contactName;
                    baseEntity.ModifiedByContactID = contactId;
                    
                    if (entity.State == EntityState.Modified)
                    {
                        _logger?.LogInformation("Modifying {EntityType} by user {UserName}", entityType, contactName);
                    }
                }

                var markedAsDeleted = ChangeTracker.Entries()
                    .Where(x => x.Entity is BaseEntity && x.State == EntityState.Deleted);

                foreach (var entity in markedAsDeleted)
                {
                    // Set the entity to unchanged (if we mark the whole entity as Modified, every field gets sent to Db as an update)
                    entity.State = EntityState.Unchanged;

                    var baseEntity = (BaseEntity)entity.Entity;
                    // Only update the IsDeleted flag - only this will get sent to the Db
                    baseEntity.IsDeleted = true;
                    baseEntity.Modified = DateTime.UtcNow;
                    baseEntity.ModifiedBy = contactName;
                    baseEntity.ModifiedByContactID = contactId;

                    _logger?.LogInformation("Soft deleting {EntityType} by user {UserName}", 
                        entity.Entity.GetType().Name, contactName);
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "Error during SaveChangesAsync");
            throw; // Re-throw to preserve the exception
        }
    }


}
