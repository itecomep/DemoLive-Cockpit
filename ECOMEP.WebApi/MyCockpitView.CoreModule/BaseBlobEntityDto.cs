namespace MyCockpitView.CoreModule;

public abstract class BaseBlobEntityDto : BaseEntityDto
{
    public bool IsFolder { get; set; }
    public int? ParentID { get; set; }
    public string? FolderPath { get; set; }
    public string? BlobPath { get; set; }
    public string? Container { get; set; }
    public string? ContentType { get; set; }
    public string? Filename { get; set; }
    public string? Guidname { get; set; }
    public string? OriginalUrl { get; set; }
    public int Size { get; set; }
    public string? ThumbFilename { get; set; }
    public string? ThumbUrl { get; set; }
    public string? Url { get; set; }
    public bool IsProcessed { get; set; } = false;
}
