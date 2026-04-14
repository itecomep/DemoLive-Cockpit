public class ProjectFileTag
{
    public int ID { get; set; }
    public int ProjectFileID { get; set; } // FK to ProjectFiles
    public string TagName { get; set; } = "";

    // Navigation back to file
    public ProjectFiles ProjectFile { get; set; }
}
