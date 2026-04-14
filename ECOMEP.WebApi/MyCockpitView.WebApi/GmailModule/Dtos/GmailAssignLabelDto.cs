public class GmailAssignLabelDto
{
    public string UserId { get; set; } = "";
    public string LabelId { get; set; } = "";
    public string LabelName { get; set; } = ""; 
    public List<string> MessageIds { get; set; } = new();
}


public class GmailLabelsDto
{
    public string UserId { get; set; } = string.Empty;
    public List<LabelDto> Labels { get; set; } = new();
}

public class LabelDto
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
}


public class GmailSignatureDto
{
    public string? Signature { get; set; }
}