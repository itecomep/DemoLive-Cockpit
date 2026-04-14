public class ProjectFolder
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string FolderName { get; set; } = "";
    public string? Classification { get; set; } = "";
     public int? ParentFolderId { get; set; } 
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = "";
    public ICollection<ProjectFolderDeny> DeniedUsers { get; set; } = new List<ProjectFolderDeny>();
}
