using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class GmailToken
{
    [Key]
    public int Id { get; set; }

    public int ProjectId { get; set; }

    public string AccessToken { get; set; }

    public string RefreshToken { get; set; }

    [Column(TypeName = "datetime2(7)")]
    public DateTime ExpiryTime { get; set; }

    [Column(TypeName = "datetime2(7)")]
    public DateTime CreatedAt { get; set; }

    [Column(TypeName = "datetime2(7)")]
    public DateTime UpdatedAt { get; set; }
    public string GmailAddress { get; set; } = "";
   public string? UserId { get; set; }
}
