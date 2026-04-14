public class ProjectFiles
{
    public int ID { get; set; }
    public int ProjectID { get; set; }
    public string FileName { get; set; }
    public string BlobPath { get; set; }
    public string BlobUrl { get; set; }
    public string? Classification { get; set; }
    public long FileSize { get; set; }
    public int? FolderId { get; set; }
    public DateTime Created { get; set; }
    public string CreatedBy { get; set; }
    public ICollection<ProjectFileTag> Tags { get; set; } = new List<ProjectFileTag>();
    public ICollection<ProjectFileDeny> DeniedUsers { get; set; } = new List<ProjectFileDeny>();
}
