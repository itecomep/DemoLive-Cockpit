using System.ComponentModel.DataAnnotations.Schema;

[Table("SubFolderMaster")]
public class ProjectSubFolderDMSFile
{
    public int Id { get; set; }
    public string FolderName { get; set; } = "";
    public string CreatedBy { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}