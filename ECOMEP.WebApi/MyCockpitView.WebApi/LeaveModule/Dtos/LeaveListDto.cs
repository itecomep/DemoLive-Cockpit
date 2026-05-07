namespace MyCockpitView.WebApi.LeaveModule.Dtos
{
    public class LeaveListDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public string ApplicationType { get; set; }
        public string Reason { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Days { get; set; }
        public string Status { get; set; }
        public string AttachmentUrl { get; set; }
        public int StatusFlag { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ActionDate { get; set; }
    }
    public class UpdateStatusDto
    {
        public string Status { get; set; }
    }
}
