public class AddClassificationDto
{
    public string Name { get; set; }
    public string CreatedBy { get; set; }
}
public class RenameFolderDto
{
    public int ProjectId { get; set; }
    public int FolderId { get; set; }
    public string NewName { get; set; }
}

