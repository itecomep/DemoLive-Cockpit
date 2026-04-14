using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.CoreModule;

public abstract class BaseBlobEntity : BaseEntity
{
    public bool IsFolder { get; set; }
    public int? ParentID { get; set; }
    public string? FolderPath { get; set; }
    public string? BlobPath { get; set; }
    public string? Container { get; set; }

    [StringLength(255)]
    public string? ContentType { get; set; }

    [Required]
    [StringLength(255)]
    public string? Filename { get; set; }
    public string? Guidname { get; set; }
    public string? OriginalUrl { get; set; }
    public int Size { get; set; }
    public string? ThumbFilename { get; set; }
    public string? ThumbUrl { get; set; }
    public string? Url { get; set; }
    public bool IsProcessed { get; set; } = false;
}

public class BaseBlobEntityConfiguration<T> : BaseEntityConfiguration<T> ,IEntityTypeConfiguration<T> where T : BaseBlobEntity
{
    public void Configure(EntityTypeBuilder<T> builder)
    {
        base.Configure(builder);

        builder.HasIndex(e => e.Filename);
        builder.HasIndex(e => e.IsFolder);
        
    }
}
