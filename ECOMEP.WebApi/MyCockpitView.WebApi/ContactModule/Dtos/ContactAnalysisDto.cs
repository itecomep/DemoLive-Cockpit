namespace MyCockpitView.WebApi.ContactModule.Dtos
{
    public class ContactAnalysisDto
    {
        public int ID { get; set; }
        public bool IsCompany { get; set; }

        public string? Type { get; set; }
        public string? Name { get; set; }
        public string? Ctegory { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Area { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }

        //IDAC SPECIFIC
        public string? Source { get; set; }
        public string? Grade { get; set; }
        public int EmployeeCount { get; set; } = 0;
        public string? RelationshipManager { get; set; }

        public string? Note { get; set; }
        public DateTime? ActionOn { get; set; }
        public string? ActionBy { get; set; }
    }
}
