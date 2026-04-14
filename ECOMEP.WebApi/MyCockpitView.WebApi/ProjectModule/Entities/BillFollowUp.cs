namespace MyCockpitView.WebApi.ProjectModule.Entities
{
    public class BillFollowUp
    {
        public int ID { get; set; }
        public int BillId { get; set; }

        public string? CommunicatedByClient { get; set; }
        public DateTime? CommunicationDate { get; set; }
        public string? CommunicatedTo { get; set; }
        public string? Response { get; set; }
        public DateTime? NextFollowUpDate { get; set; }

        public string? AttachmentUrl { get; set; }

        public DateTime Created { get; set; }
        public DateTime? Modified { get; set; }

        public bool IsDeleted { get; set; }
    }
}
