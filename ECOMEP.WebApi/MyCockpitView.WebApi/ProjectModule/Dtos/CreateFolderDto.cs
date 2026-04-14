public class CreateFolderDto
{
    public int ProjectId { get; set; }
    public string FolderName { get; set; } = "";
    public string? Classification { get; set; }
    public int? ParentFolderId { get; set; } 
    public string? CreatedBy { get; set; }
}