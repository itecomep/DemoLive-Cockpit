using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.TargetPointModule.Dtos;
using MyCockpitView.WebApi.TargetPointModule.Entities;

namespace MyCockpitView.WebApi.TargetPointModule.Services;

public interface ITeamTargetPointService
{
    // DTO GET FOR UI
    IQueryable<TeamTargetPointDto> Get();

    // ENTITY GET FOR UPDATE/DELETE
    IQueryable<TeamTargetPoint> GetEntity();

    // GET ALL CONTACT TEAMS
    IQueryable<ContactTeam> GetAllTeams();

    // CREATE
    Task<int> Create(TeamTargetPoint entity);

    // UPDATE
    Task Update(TeamTargetPoint entity);

    // DELETE
    Task Delete(int id);
}