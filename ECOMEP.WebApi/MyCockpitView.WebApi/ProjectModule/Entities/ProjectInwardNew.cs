// using System;

// namespace MyCockpitView.WebApi.ProjectModule.Entities
// {
//     public class ProjectInwardNew
//     {
//         public int ID { get; set; }

//         public string Title { get; set; }

//         public string Message { get; set; }

//         public string Category { get; set; }

//         public DateTime ReceivedDate { get; set; }

//         public int? ContactID { get; set; }

//         public int? ProjectID { get; set; }

//         public string AttachmentPath { get; set; }
//     }
// }












using System;

namespace MyCockpitView.WebApi.ProjectModule.Entities
{
    public class ProjectInwardNew
    {
        public int ID { get; set; }

        public string? Title { get; set; }

        public string? Message { get; set; }

        public string? Category { get; set; }

        public DateTime ReceivedDate { get; set; }

        public int? ContactID { get; set; }

        public int? ProjectID { get; set; }

        public string? AttachmentPath { get; set; }
    }
}