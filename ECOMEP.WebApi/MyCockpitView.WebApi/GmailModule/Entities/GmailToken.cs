using System;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.GmailModule.Entities
{
    public class GmailToken
    {
        [Key] 
        public int Id { get; set; }  
        public int ProjectId { get; set; }

        public string AccessToken { get; set; } = null!;

        public string RefreshToken { get; set; } = null!;

        public DateTime ExpiryTime { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
