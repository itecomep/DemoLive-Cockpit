using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.ContactModule.Dtos;

public class ContactTeamMemberDto : BaseEntityDto
{
    public int ContactTeamID { get; set; }
    public int ContactID { get; set; }
    public virtual ContactListDto? Contact { get; set; }
    public bool IsLeader { get; set; }
    public bool IsAssistantLeader { get; set; }
}

public class ContactTeamMemberMapperProfile : Profile
{
    public ContactTeamMemberMapperProfile()
    {

        CreateMap<ContactTeamMember, ContactTeamMemberDto>()
         .ReverseMap()
                    .ForMember(dest => dest.ContactTeam, opt => opt.Ignore())
           .ForMember(dest => dest.Contact, opt => opt.Ignore());

    }
}
