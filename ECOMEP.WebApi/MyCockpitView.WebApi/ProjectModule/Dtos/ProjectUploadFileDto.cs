public class ProjectUploadFileDto
{
    public IFormFile File { get; set; }
    public string? FolderPath { get; set; }
    public string? Classification { get; set; }
    public int ProjectId { get; set; }
    public string Tag { get; set; } = ""; 
    public string? CreatedBy { get; set; }
}
public class ProjectUploadMultipleDto
{
    public List<IFormFile> Files { get; set; } = new();
    public string? FolderPath { get; set; }
    public int? FolderId { get; set; }
    public string? Classification { get; set; }
    public int ProjectId { get; set; }
    public List<string>? Tags { get; set; }
    public string? CreatedBy { get; set; }
}