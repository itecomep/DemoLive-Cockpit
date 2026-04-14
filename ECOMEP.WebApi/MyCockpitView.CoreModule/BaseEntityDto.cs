namespace MyCockpitView.CoreModule;


public abstract class BaseEntityDto :BaseEntity
{
    public bool IsReadOnly { get; set; } = false;
    public ICollection<string> SearchTags { get; set; } = new List<string>() { };
    public string? StatusValue { get; set; }
    public string? TypeValue { get; set; }

}
