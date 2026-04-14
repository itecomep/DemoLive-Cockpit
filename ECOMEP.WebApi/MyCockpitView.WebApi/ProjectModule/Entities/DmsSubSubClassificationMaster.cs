public class DmsSubSubClassificationMaster
{
    public int ID { get; set; }

    public string Name { get; set; } = null!;

    public int SubClassificationId { get; set; }   // 👈 FK to Level 2

    public bool IsActive { get; set; }

    public int SortOrder { get; set; }

    public DateTime Created { get; set; } = DateTime.UtcNow;

    public string? CreatedBy { get; set; }

    // 🔗 Navigation
    public DmsSubClassificationMaster SubClassification { get; set; } = null!;
}