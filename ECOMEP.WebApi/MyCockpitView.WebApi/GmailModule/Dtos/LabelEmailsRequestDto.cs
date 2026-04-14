public class LabelEmailsRequestDto
{
    public string LabelName { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
