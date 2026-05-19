using System.ComponentModel.DataAnnotations.Schema;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.TargetPointModule.Entities;

public class TeamTargetPoint : BaseEntity
{
    public int ContactTeamID { get; set; }

    public decimal Points { get; set; }

    [ForeignKey(nameof(ContactTeamID))]
    public virtual ContactTeam? ContactTeam { get; set; }
}