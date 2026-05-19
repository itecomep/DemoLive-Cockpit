using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.TargetPointModule.Dtos;
using MyCockpitView.WebApi.TargetPointModule.Entities;

namespace MyCockpitView.WebApi.TargetPointModule.Services;

public class TeamTargetPointService : ITeamTargetPointService
{
    private readonly EntitiesContext db;

    public TeamTargetPointService(EntitiesContext db)
    {
        this.db = db;
    }

    // =====================================
    // GET TEAM TARGET POINTS
    // =====================================
    public IQueryable<TeamTargetPointDto> Get()
    {
        return db.TeamTargetPoints
            .Where(x => !x.IsDeleted)
            .Select(x => new TeamTargetPointDto
            {
                ID = x.ID,
                ContactTeamID = x.ContactTeamID,
                TeamName = x.ContactTeam != null
                    ? x.ContactTeam.Title
                    : "",
                Points = x.Points,
                Created = x.Created
            });
    }

    // =====================================
    // GET ALL CONTACT TEAMS
    // =====================================
    public IQueryable<ContactTeam> GetAllTeams()
    {
        return db.ContactTeams
            .Where(x => !x.IsDeleted)
            .AsQueryable();
    }

    // =====================================
    // CREATE
    // =====================================
    public async Task<int> Create(TeamTargetPoint entity)
    {
        db.TeamTargetPoints.Add(entity);

        await db.SaveChangesAsync();

        return entity.ID;
    }

    // =====================================
    // UPDATE
    // =====================================
    public async Task Update(TeamTargetPoint entity)
    {
        db.TeamTargetPoints.Attach(entity);

        db.Entry(entity).Property(x => x.ContactTeamID).IsModified = true;
        db.Entry(entity).Property(x => x.Points).IsModified = true;

        await db.SaveChangesAsync();
    }

    // =====================================
    // DELETE
    // =====================================
    public async Task Delete(int id)
    {
        var entity = new TeamTargetPoint
        {
            ID = id,
            IsDeleted = true
        };

        db.TeamTargetPoints.Attach(entity);

        db.Entry(entity).Property(x => x.IsDeleted).IsModified = true;

        await db.SaveChangesAsync();
    }

    public IQueryable<TeamTargetPoint> GetEntity()
    {
        return db.TeamTargetPoints
            .Where(x => !x.IsDeleted)
            .AsQueryable();
    }
}