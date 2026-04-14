using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ContactModule.Dtos;

public class ContactTeamDto : BaseEntityDto
{

    [StringLength(255)]
    public string? Title { get; set; }
    public int? LeaderID { get; set; }
    public int? AssistantID { get; set; }
    public virtual ICollection<ContactTeamMemberDto> Members { get; set; } = new List<ContactTeamMemberDto>();

}

public class ContactTeamMapperProfile : Profile
{
    public ContactTeamMapperProfile()
    {

        CreateMap<ContactTeam, ContactTeamDto>()
         .ReverseMap()
          .ForMember(dest => dest.Members, opt => opt.Ignore());

    }
}
