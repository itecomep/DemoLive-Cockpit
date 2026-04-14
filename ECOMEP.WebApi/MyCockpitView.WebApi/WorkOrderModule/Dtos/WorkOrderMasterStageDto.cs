using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.WorkOrderModule.Dtos;
using MyCockpitView.WebApi.WorkOrderModule.Entities;

namespace MyCockpitView.WebApi.WorkOrderModule.Dtos
{
    public class WorkOrderMasterStageDto : BaseEntityDto
    {
        public int WorkOrderMasterID { get; set; }
        public virtual WorkOrderMasterStageDto? WorkOrderMasterStage { get; set; }
        public string Title { get; set; }
        public int Value { get; set; }
    }
}

public class WorkOrderMasterStageDtoMapperProfile : Profile
{
    public WorkOrderMasterStageDtoMapperProfile()
    {
        CreateMap<WorkOrderMasterStage, WorkOrderMasterStageDto>()
            .ReverseMap();
    }
}