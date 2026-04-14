using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.Entities;

public class ProjectWorkOrderMasterDto : BaseEntity
{

    [Required]
    [StringLength(255)]
    public string? Template { get; set; }

    public virtual ICollection<ProjectWorkOrderSegmentMasterDto> Segments { get; set; } = new List<ProjectWorkOrderSegmentMasterDto>();

}