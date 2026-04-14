using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyCockpitView.WebApi.GmailModule.Entities
{
    [NotMapped] 
    public class GmailContact
    {
        [Key]
        public int Id { get; set; }

        public string EmailsJson { get; set; } = "";
    }
}
