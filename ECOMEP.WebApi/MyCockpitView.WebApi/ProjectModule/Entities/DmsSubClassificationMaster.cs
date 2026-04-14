public class DmsSubClassificationMaster
{
    public int ID { get; set; }

    public string Name { get; set; } = null!;

    public int ClassificationId { get; set; }   // 👈 FK to Level 1

    public bool IsActive { get; set; }

    public int SortOrder { get; set; }

    public DateTime Created { get; set; } = DateTime.UtcNow;

    public string? CreatedBy { get; set; }

    // 🔗 Navigation
    public DmsClassificationMaster Classification { get; set; } = null!;

    public ICollection<DmsSubSubClassificationMaster> SubSubClassifications { get; set; } = new List<DmsSubSubClassificationMaster>();
}