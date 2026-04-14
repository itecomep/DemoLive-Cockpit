using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.Entities;

public class ProjectWorkOrderSegmentDto : BaseEntity
{
    [Required]
    [StringLength(255)]
    public string? Title { get; set; }

    public string? Content { get; set; }

    public int ProjectWorkOrderID { get; set; }

}