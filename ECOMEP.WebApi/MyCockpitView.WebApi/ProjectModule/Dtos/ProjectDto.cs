using AutoMapper;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.CoreModule;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ProjectModule.Entities;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.Dtos;

public class ProjectListDto : BaseEntityDto
{

    public string? Code { get; set; }
    public string? Title { get; set; }
    public DateTime? ContractCompletionDate { get; set; }
    public DateTime? InquiryConvertionDate { get; set; }
    public DateTime? ExpectedCompletionDate { get; set; }
    public string? Location { get; set; }
    public int? CompanyID { get; set; }
    public string? Segment { get; set; }
    public string? Typology { get; set; }
}

public class ProjectDto :ProjectListDto
{

    public string? BillingTitle { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public string? StateCode { get; set; }
    [StringLength(255)]
    public string? PinCode { get; set; }
    [StringLength(255)]
    public string? PAN { get; set; }
    [StringLength(255)]
    public string? TAN { get; set; }
    [StringLength(255)]
    public string? GSTIN { get; set; }
    [StringLength(255)]
    public string? HSN { get; set; }
    [StringLength(255)]
    public string? ARN { get; set; }
    public DateTime? ContractStartDate { get; set; }
    public string? Comment { get; set; }
    public decimal Fee { get; set; }
    public decimal Discount { get; set; }
    public int? ProjectManagerContactID { get; set; }
    public int? GroupContactID { get; set; }
    public int? ClientContactID { get; set; }
    public int? ReferredByContactID { get; set; }
    public int? GroupCompanyContactID { get; set; }
    public int? AssistantProjectManagerContactID { get; set; }
    public virtual ContactListDto? ClientContact { get; set; }
    public virtual ContactListDto? ReferredByContact { get; set; }
    public virtual ContactListDto? GroupCompanyContact { get; set; }
    public virtual ContactListDto? GroupContact { get; set; }
    public virtual ContactListDto? ProjectManagerContact { get; set; }
    public virtual ContactListDto? AssistantProjectManagerContact { get; set; }
    public virtual ICollection<ProjectAttachmentDto> Attachments { get; set; } = new HashSet<ProjectAttachmentDto>();                  
    public virtual ICollection<ProjectAssociationDto> Associations { get; set; } = new HashSet<ProjectAssociationDto>();
    public virtual Company? Company { get; set; }

    public decimal ExpectedMHr { get; set; }
    public decimal LandscapeArea { get; set; }
    public decimal FacadeArea { get; set; }
    public decimal InteriorArea { get; set; }
    public string? ScopeOfWork { get; set; }
    public virtual ICollection<ProjectWorkOrderDto> WorkOrders { get; set; } = new HashSet<ProjectWorkOrderDto>();

    public virtual ICollection<ProjectInwardDto> Inwards { get; set; } = new HashSet<ProjectInwardDto>();
    public virtual ICollection<ProjectNoteDto> Notes { get; set; } = new HashSet<ProjectNoteDto>();

    public virtual ICollection<ProjectAreaDto> Areas { get; set; } = new HashSet<ProjectAreaDto>();
    public virtual ICollection<ProjectStageDto> Stages { get; set; } = new HashSet<ProjectStageDto>();
    public int? ParentID { get; set; }
    public virtual ICollection<ProjectTeamDto> Teams { get; set; } = new List<ProjectTeamDto>();
}
public class ProjectDtoMapperProfile : Profile
{
    public ProjectDtoMapperProfile()
    {

        CreateMap<Project, ProjectListDto>();

        CreateMap<Project, ProjectDto>()
            .ReverseMap()
              .ForMember(dest => dest.Teams, opt => opt.Ignore())
            .ForMember(dest => dest.ClientContact, opt => opt.Ignore())
            .ForMember(dest => dest.ProjectManagerContact, opt => opt.Ignore())
            .ForMember(dest => dest.AssistantProjectManagerContact, opt => opt.Ignore())
            .ForMember(dest => dest.ReferredByContact, opt => opt.Ignore())
            .ForMember(dest => dest.GroupCompanyContact, opt => opt.Ignore())
            .ForMember(dest => dest.GroupContact, opt => opt.Ignore())
              .ForMember(dest => dest.Company, opt => opt.Ignore())
              .ForMember(dest => dest.Attachments, opt => opt.Ignore())
              .ForMember(dest => dest.WorkOrders, opt => opt.Ignore())
               .ForMember(dest => dest.Inwards, opt => opt.Ignore())
                .ForMember(dest => dest.Notes, opt => opt.Ignore())
                .ForMember(dest => dest.Areas, opt => opt.Ignore())
                .ForMember(dest => dest.Stages, opt => opt.Ignore())
              .ForMember(dest => dest.Associations, opt => opt.Ignore());

    }
}