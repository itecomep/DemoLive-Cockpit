public class FolderNodeDto
{
    public int Id { get; set; }  
    public string Name { get; set; }
    public List<FolderNodeDto> Children { get; set; } = new();
    public List<FileDto> Files { get; set; } = new();
    public List<string>? DeniedUsers { get; set; }
}
public class FileDto
{
    public int Id { get; set; }
    public string FileName  { get; set; }
    public string BlobUrl { get; set; }
    public string? Classification { get; set; }
    public List<string> Tags { get; set; } = new();
    public string CreatedBy { get; set; }
    public DateTime Created { get; set; }
    public long FileSize { get; set; }
    public string Path { get; set; }
    public List<string>? DeniedUsers { get; set; }
}