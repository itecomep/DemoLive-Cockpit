using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.LeaveModule.Dtos;
using MyCockpitView.WebApi.LeaveModule.Entities;

namespace MyCockpitView.WebApi.LeaveModule.Dtos
{
    public class LeaveDto : BaseEntityDto
    {
        public int ContactID { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public bool AllDay { get; set; }
        public decimal Total { get; set; }
        public string Reason { get; set; }
        public ContactListDto Contact { get; set; }
        public string? Title { get; set; }

        public virtual ICollection<LeaveAttachmentDto> Attachments { get; set; } = new List<LeaveAttachmentDto>();
    }

    public class LeaveAttachmentDto : BaseBlobEntityDto
    {
        public int LeaveID { get; set; }
    }
}

public class LeaveDtoMapperProfile : Profile
{
    public LeaveDtoMapperProfile()
    {
        CreateMap<Leave, LeaveDto>()
            .ReverseMap()
            .ForMember(dest => dest.Contact, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());

        CreateMap<LeaveAttachment, LeaveAttachmentDto>()
            .ReverseMap()
            .ForMember(dest => dest.Leave, opt => opt.Ignore());

        CreateMap<Contact, ContactListDto>().ReverseMap();
    }
}