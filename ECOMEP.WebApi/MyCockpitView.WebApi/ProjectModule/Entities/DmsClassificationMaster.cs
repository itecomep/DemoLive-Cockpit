public class DmsClassificationMaster
{
    public int ID { get; set; }
    public string Name { get; set; } = null!;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }
    public ICollection<DmsSubClassificationMaster> SubClassifications { get; set; } = new List<DmsSubClassificationMaster>();
}
