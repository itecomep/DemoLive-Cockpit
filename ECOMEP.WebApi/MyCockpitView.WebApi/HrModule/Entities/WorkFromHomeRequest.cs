namespace MyCockpitView.WebApi.HrModule.Entities
{
    public class WorkFromHomeRequest
    {
        public int ID { get; set; }

        public int UserID { get; set; }
        public string? UserName { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string? Reason { get; set; }

        public string? AttachmentName { get; set; }

        public string Status { get; set; } = "PENDING";

        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }

        public bool IsDeleted { get; set; }
    }
}
