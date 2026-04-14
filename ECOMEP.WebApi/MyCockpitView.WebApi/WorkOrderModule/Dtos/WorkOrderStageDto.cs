using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Dtos;
using MyCockpitView.WebApi.WorkOrderModule.Dtos;
using MyCockpitView.WebApi.WorkOrderModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.WorkOrderModule.Dtos
{
    public class WorkOrderStageDto : BaseEntityDto
    {
        [Required]
        public int WorkOrderID { get; set; }
        public virtual WorkOrderDto? WorkOrder { get; set; }

        [Required]
        public int ProjectID { get; set; }
        public virtual ProjectDto? Project { get; set; }
        [StringLength(255)]
        [Required]
        public string? Title { get; set; }
        [StringLength(10)]
        public string? Abbreviation { get; set; }
        [Precision(18, 2)] public decimal Percentage { get; set; }
        [Precision(18, 2)] public decimal Amount { get; set; }
        public bool IsLumpsum { get; set; }
        public int Revisions { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? BillingDate { get; set; }
        public DateTime? PaymentReceivedDate { get; set; }
        public int? ParentID { get; set; }
        public virtual WorkOrderStageDto? Parent { get; set; }
        public virtual ICollection<WorkOrderStageDto> Children { get; set; } = new HashSet<WorkOrderStageDto>();
    }
}

public class WorkOrderStageMapperProfile : Profile
{
    public WorkOrderStageMapperProfile()
    {
        CreateMap<WorkOrderStage, WorkOrderStageDto>()
            .ReverseMap()
            .ForMember(dest => dest.Project, opt => opt.Ignore())
            .ForMember(dest => dest.WorkOrder, opt => opt.Ignore())
            .ForMember(dest => dest.Children, opt => opt.Ignore());
    }
}