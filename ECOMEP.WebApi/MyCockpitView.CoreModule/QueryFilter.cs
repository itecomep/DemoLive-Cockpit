namespace MyCockpitView.CoreModule;

public class APIFilter
{
    public IEnumerable<QueryFilter>? Filters { get; set; }
}
public class QueryFilter
{
    public string? Key { get; set; }
    public string? Value { get; set; }
    public string? Operator { get; set; } = "eq";
    public string? ValueType { get; set; } = "string";

}
