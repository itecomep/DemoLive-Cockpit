using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using System.ComponentModel.DataAnnotations;


namespace MyCockpitView.WebApi.Entities;

public class ProjectWorkOrderAreaDto : BaseEntity
{
    [Required]
    [StringLength(50)]
    public string? AreaTitle { get; set; }

    [Precision(18,2)] public decimal Area { get; set; } = 0.0m;

    [StringLength(50)]
    public string? Unit { get; set; }

    [Precision(18,2)] public decimal Rate { get; set; } = 0.0m;
    [Precision(18,2)] public decimal Fees { get; set; } = 0.0m;
    [Precision(18,2)] public decimal Share { get; set; } = 0.0m;

    [Required]
    public int ProjectWorkOrderID { get; set; }
}