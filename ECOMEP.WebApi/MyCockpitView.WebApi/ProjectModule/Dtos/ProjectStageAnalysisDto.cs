using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.CompanyModule;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.TodoModule.Dtos;
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.ProjectModule.Dtos;

public class ProjectStageAnalysisDto
{
    public int ProjectID { get; set; }
    public string? Title { get; set; }
    public string? Code { get; set; }
    public int StatusFlag { get; set; }
    public string? StatusValue { get; set; }
    public string? Typology { get; set; }
    public string? ClientContact { get; set; }
    public DateTime? ContractStartDate { get; set; }
    public DateTime? ContractCompletionDate { get; set; }
    public decimal Fee { get; set; }
    public decimal WorkPendingPercentage { get; set; }
    public decimal WorkCompletedPercentage { get; set; }
    public decimal BilledPercentage { get; set; }
    public decimal PaymentReceivedPercentage { get; set; }
    public decimal WorkPendingAmount { get; set; }
    public decimal WorkCompletedAmount { get; set; }
    public decimal BilledAmount { get; set; }
    public decimal PaymentReceivedAmount { get; set; }
    public ICollection<StageAnalysisDto> Stages { get; set; } = new List<StageAnalysisDto>();
    public ICollection<StageAnalysisTeam> Teams { get; set; } = new List<StageAnalysisTeam>();
}

public class StageAnalysisDto
{
    public int ProjectID { get; set; }
    public string Title { get; set; }
    public int StatusFlag { get; set; }
    public string StatusValue { get; set; }
    public decimal Percentage { get; set; }
    public DateTime? TargetDate { get; set; }
    public DateTime? BillingDate { get; set; }
    public DateTime? PaymentReceivedDate { get; set; }

}

public class StageAnalysisTeam
{
    public int ID { get; set; }
    public string Title { get; set; }
}