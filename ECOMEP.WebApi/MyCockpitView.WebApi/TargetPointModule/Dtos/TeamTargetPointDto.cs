////namespace MyCockpitView.WebApi.TargetPointModule.Dtos
////{
////    public class TeamTargetPointDto
////    {
////    }
////}
using AutoMapper;
using MyCockpitView.WebApi.TargetPointModule.Entities;

namespace MyCockpitView.WebApi.TargetPointModule.Dtos;

public class TeamTargetPointDto
{
    public int ID { get; set; }

    public int ContactTeamID { get; set; }

    public string? TeamName { get; set; }

    public decimal Points { get; set; }

    public DateTime? Created { get; set; }
}

public class TeamTargetPointMapperProfile : Profile
{
    public TeamTargetPointMapperProfile()
    {
        CreateMap<TeamTargetPoint, TeamTargetPointDto>()
            .ForMember(
                dest => dest.TeamName,
                opt => opt.MapFrom(src => src.ContactTeam!.Title)
            );

        CreateMap<TeamTargetPointDto, TeamTargetPoint>();
    }
}