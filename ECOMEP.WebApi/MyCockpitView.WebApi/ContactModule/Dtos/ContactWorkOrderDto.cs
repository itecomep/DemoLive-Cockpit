using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;
using AutoMapper;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.CompanyModule;


namespace MyCockpitView.WebApi.Entities;

public class ContactWorkOrderDto
    : BaseEntity
{
    [Precision(18,2)] public decimal Rate { get; set; } = 0.0m;
    [Precision(18,2)] public decimal Fees { get; set; } = 0.0m;
    [Precision(18,2)] public decimal Share { get; set; } = 0.0m;
    [Required]
    public int ContactID { get; set; }

    public virtual Contact? Contact { get; set; }
    public int? CompanyID { get; set; }
    public virtual Company? Company { get; set; }

    [StringLength(255)]
    public string? WorkOrderNo { get; set; }
    public DateTime? DueDate { get; set; }

    [Required]
    public DateTime WorkOrderDate { get; set; }
    [StringLength(255)]
    public string? SequenceNo { get; set; }
    public virtual ICollection<ContactWorkOrderAttachmentDto> Attachments { get; set; } = new List<ContactWorkOrderAttachmentDto>();
    public virtual ICollection<ContactWorkOrderPaymentDto> Payments { get; set; } = new List<ContactWorkOrderPaymentDto>();

    [StringLength(255)]
    public string? WorkDetail { get; set; } //"Architecture Design Consultancy"

    [StringLength(255)]
    public string? WorkProposalTemplate { get; set; }

    [Precision(18,2)] public decimal InteriorCost { get; set; } = 0.0m;

    public string? BlobUrl { get; set; }
}

public class ContactWorkOrderDtoMapperProfile : Profile
{
    public ContactWorkOrderDtoMapperProfile()
    {

        CreateMap<ContactWorkOrder, ContactWorkOrderDto>()
            .ReverseMap()
            .ForMember(dest => dest.Payments, opt => opt.Ignore())
            .ForMember(dest => dest.Attachments, opt => opt.Ignore());
    }
}