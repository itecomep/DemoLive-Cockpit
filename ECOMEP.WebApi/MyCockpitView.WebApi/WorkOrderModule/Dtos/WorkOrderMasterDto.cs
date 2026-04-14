using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.WorkOrderModule.Dtos;
using MyCockpitView.WebApi.WorkOrderModule.Entities;

namespace MyCockpitView.WebApi.WorkOrderModule.Dtos
{
    public class WorkOrderMasterDto : BaseEntityDto
    {
        public string TypologyTitle { get; set; }
        public virtual ICollection<WorkOrderMasterStageDto> WorkOrderMasterStages { get; set; } = new List<WorkOrderMasterStageDto>();
    }
}

public class WorkOrderMasterDtoMapperProfile : Profile
{
    public WorkOrderMasterDtoMapperProfile()
    {
        CreateMap<WorkOrderMaster, WorkOrderMasterDto>()
            .ReverseMap()
            .ForMember(dest => dest.WorkOrderMasterStages, opt => opt.Ignore());
    }
}