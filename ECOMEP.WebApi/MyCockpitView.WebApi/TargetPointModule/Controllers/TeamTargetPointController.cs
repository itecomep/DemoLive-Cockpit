using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.TargetPointModule.Dtos;
using MyCockpitView.WebApi.TargetPointModule.Entities;
using MyCockpitView.WebApi.TargetPointModule.Services;

namespace MyCockpitView.WebApi.TargetPointModule.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TeamTargetPointController : ControllerBase
{
    private readonly ITeamTargetPointService service;
    private readonly IMapper mapper;

    public TeamTargetPointController(
        ITeamTargetPointService service,
        IMapper mapper
    )
    {
        this.service = service;
        this.mapper = mapper;
    }

    // =====================================
    // GET ALL CONTACT TEAMS
    // =====================================
   
    [HttpGet("GetAllTeams")]
    public async Task<IActionResult> GetAllTeams()
    {
        var result = await service
            .GetAllTeams()
            .Select(x => new
            {
                x.ID,
                x.Title
            })
            .ToListAsync();

        return Ok(result);
    }

    // =====================================
    // GET ALL TEAM TARGET POINTS
    // =====================================
   
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await service.Get().ToListAsync();

        return Ok(result);
    }

    // =====================================
    // GET BY ID
    // =====================================

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var entity = await service
            .Get()
            .FirstOrDefaultAsync(x => x.ID == id);

        if (entity == null)
            return NotFound();

        return Ok(entity);
    }

    // =====================================
    // CREATE
    // =====================================


    [HttpPost]
    public async Task<IActionResult> Post(
        [FromBody] TeamTargetPointDto dto
    )
    {
        // current month/year
        var currentMonth = DateTime.UtcNow.Month;

        var currentYear = DateTime.UtcNow.Year;

        // check if same team already exists in same month
        var alreadyExists = await service
            .GetEntity()
            .AnyAsync(x =>
                !x.IsDeleted &&
                x.ContactTeamID == dto.ContactTeamID &&
                x.Created.Month == currentMonth &&
                x.Created.Year == currentYear
            );

        if (alreadyExists)
        {
            return BadRequest(
                "This team target point already exists for current month."
            );
        }

        var entity = new TeamTargetPoint
        {
            ContactTeamID = dto.ContactTeamID,
            Points = dto.Points,
            Created = DateTime.UtcNow
        };

        var id = await service.Create(entity);

        return Ok(new
        {
            ID = id,
            ContactTeamID = entity.ContactTeamID,
            Points = entity.Points,
            Created = entity.Created
        });
    }

    // =====================================
    // UPDATE
    // =====================================


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(
        int id,
        [FromBody] TeamTargetPointDto dto
    )
    {
        var entity = new TeamTargetPoint
        {
            ID = id,
            ContactTeamID = dto.ContactTeamID,
            Points = dto.Points
        };

        await service.Update(entity);

        return Ok(new
        {
            entity.ID,
            entity.ContactTeamID,
            entity.Points
        });
    }

    // =====================================
    // DELETE
    // =====================================

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.Delete(id);

        return Ok();
    }
}