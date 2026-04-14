using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.ProjectModule.Entities
{
    public class ProjectAreaStageDelivery : BaseEntity
    {
        [Required]
        [StringLength(255)]
        public string? Title { get; set; }
        [StringLength(10)]
        public string? Abbreviation { get; set; }
        
        [Precision(18,2)] public decimal Percentage { get; set; } = 0.0m;
        
        [Precision(18,2)] public decimal Amount { get; set; } = 0.0m;
        public int ProjectAreaStageID { get; set; }
        public virtual ProjectAreaStage? ProjectAreaStage { get; set; }
        public int? ProjectID { get; set; }
        public int? ProjectStageID { get; set; }
        public int? ProjectStageDeliveryID { get; set; }
    }

    public class ProjectAreaStageDeliveryConfiguration : IEntityTypeConfiguration<ProjectAreaStageDelivery>
    {
        public void Configure(EntityTypeBuilder<ProjectAreaStageDelivery> builder)
        {
            builder.HasQueryFilter(x => !x.IsDeleted);
            builder.HasKey(e => e.ID);
            builder.Property(e => e.ID)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID");

            builder.Property(e => e._searchTags)
                .HasColumnName("SearchTags");

            builder.Ignore(e => e.SearchTags);

            builder.Property(e => e.UID)
                .HasColumnName("UID")
                .HasDefaultValueSql("NEWID()")
                ;

            builder.Property(e => e.Created)
                ;

            builder.Property(e => e.Modified)
                ;

            builder.Property(e => e.CreatedBy)
                .HasMaxLength(255);

            builder.Property(e => e.ModifiedBy)
                .HasMaxLength(255);

            builder.Property(e => e.OrderFlag)
                //.HasColumnType("decimal(14,2)")
                .HasDefaultValue(0);

            builder.Property(e => e.StatusFlag)
        .HasDefaultValue(0);

            builder.Property(e => e.TypeFlag)
        .HasDefaultValue(0);

            builder.Property(e => e.IsDeleted)
    .HasDefaultValue(false);

            builder.HasIndex(e => e.UID);
            builder.HasIndex(e => e.Created);
            builder.HasIndex(e => e.Modified);
            builder.HasIndex(e => e.CreatedByContactID);
            builder.HasIndex(e => e.ModifiedByContactID);
            builder.HasIndex(e => e.StatusFlag);
            builder.HasIndex(e => e.TypeFlag);
            builder.HasIndex(e => e.IsDeleted);
            builder.HasIndex(e => e.OrderFlag);
            builder
                .HasOne(u => u.ProjectAreaStage)
                .WithMany(c => c.Deliveries)
                .HasForeignKey(x => x.ProjectAreaStageID).IsRequired();

           

        }
    }
}
