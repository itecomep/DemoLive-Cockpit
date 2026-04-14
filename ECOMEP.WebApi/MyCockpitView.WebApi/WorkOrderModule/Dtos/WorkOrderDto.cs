using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.WorkOrderModule.Dtos;
using MyCockpitView.WebApi.WorkOrderModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.WorkOrderModule.Dtos
{
    public class WorkOrderDto : BaseEntityDto
    {
        [Required]
        public int ProjectID { get; set; }
        public virtual Project? Project { get; set; }
        public int CompanyID { get; set; }
        public virtual Company? Company { get; set; }

        [Required]
        public string Typology { get; set; }

        [StringLength(255)]
        public string? WorkOrderNo { get; set; }
        [Required]
        public DateTime WorkOrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        [Precision(18, 2)] public decimal? Area { get; set; } = 0.0m;
        public bool IsLumpSum { get; set; }
        [Precision(18, 2)] public decimal? Rate { get; set; } = 0.0m;
        public int Amount { get; set; }
        public virtual ICollection<WorkOrderAttachmentDto> Attachments { get; set; } = new List<WorkOrderAttachmentDto>();
        public virtual ICollection<WorkOrderStageDto> Stages { get; set; } = new List<WorkOrderStageDto>();
    }
}

public class WorkOrderMapperProfile : Profile
{
    public WorkOrderMapperProfile()
    {
        CreateMap<WorkOrder, WorkOrderDto>()
            .ReverseMap()
            .ForMember(dest => dest.Attachments, opt => opt.Ignore())
            .ForMember(dest => dest.Stages, opt => opt.Ignore())
            .ForMember(dest => dest.Company, opt => opt.Ignore())
            .ForMember(dest => dest.Project, opt => opt.Ignore()); 
    }
}