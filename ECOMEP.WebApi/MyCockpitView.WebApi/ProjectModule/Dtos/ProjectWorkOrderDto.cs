using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AutoMapper;
using MyCockpitView.WebApi.Dtos;


namespace MyCockpitView.WebApi.Entities;

public class ProjectWorkOrderDto : BaseEntity
{
    [StringLength(50)]
    public string? AreaTitle { get; set; }

    [Precision(18,2)] 
    public decimal Area { get; set; } = 0.0m;

    [StringLength(50)]
    public string? Unit { get; set; }

    [Precision(18,2)] 
    public decimal Rate { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal Fees { get; set; } = 0.0m;
    [Precision(18,2)] 
    public decimal Share { get; set; } = 0.0m;
    [Required]
    public int ProjectID { get; set; }
    public virtual Project? Project { get; set; }
    public int? ClientContactID { get; set; }
    public int? CompanyID { get; set; }
    [StringLength(255)]
    public string? WorkOrderNo { get; set; }
    public DateTime? DueDate { get; set; }

    [Required]
    public DateTime WorkOrderDate { get; set; }

    public virtual ICollection<ProjectWorkOrderAttachmentDto> Attachments { get; set; } = new List<ProjectWorkOrderAttachmentDto>();

    [StringLength(255)]
    public string? WorkDetail { get; set; } //"Architecture Design Consultancy"

    [StringLength(255)]
    public string? WorkProposalTemplate { get; set; }

    public string? BlobUrl { get; set; }

    public virtual ICollection<ProjectWorkOrderSegmentDto> Segments { get; set; } = new List<ProjectWorkOrderSegmentDto>();
    public virtual ICollection<ProjectWorkOrderAreaDto> Areas { get; set; } = new List<ProjectWorkOrderAreaDto>();
    public virtual ICollection<ProjectWorkOrderServiceAmountDto> ServiceAmounts { get; set; } = new List<ProjectWorkOrderServiceAmountDto>();
}

public class ProjectWorkOrderDtoMapperProfile : Profile
{
    public ProjectWorkOrderDtoMapperProfile()
    {

        CreateMap<ProjectWorkOrder, ProjectWorkOrderDto>()
            .ReverseMap()
            .ForMember(dest => dest.Attachments, opt => opt.Ignore())
            .ForMember(dest => dest.Segments, opt => opt.Ignore())
            .ForMember(dest => dest.ServiceAmounts, opt => opt.Ignore())
            .ForMember(dest => dest.Areas, opt => opt.Ignore());
    }
}