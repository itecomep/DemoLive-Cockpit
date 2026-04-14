public class AddFullClassificationDto
{
    public string Classification { get; set; } = null!;
    public string? SubClassification { get; set; }
    public string? SubSubClassification { get; set; }
    public string? CreatedBy { get; set; }
}