public class ContactEmailDto
{
    public string Email { get; set; } = "";
    public string Title { get; set; } = "";
    public bool IsPrimary { get; set; }
    public string FullName { get; set; } = "";
}

public class ContactEmailJson
{
    public string Title { get; set; } = "";
    public string Email { get; set; } = "";
    public bool IsPrimary { get; set; }
}