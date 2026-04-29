using System.Text.Json.Serialization;

namespace MyCockpitView.WebApi.HrModule.Dtos
{
    public class AttachmentDto
    {      
        public string FileName { get; set; }  
        public string Url { get; set; }

    }
    public class StatusUpdateDto
    {
        public string Status { get; set; }
    }
}
