using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.HrModule.Dtos;
using MyCockpitView.WebApi.HrModule.Entities;

namespace MyCockpitView.WebApi.HrModule.Controllers;

[Route("[controller]")]
[ApiController]
public class DepartmentController : ControllerBase
{
    private readonly EntitiesContext db;
    private readonly IMapper mapper;

    public DepartmentController(
        EntitiesContext db,
        IMapper mapper)
    {
        this.db = db;
        this.mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var results = mapper.Map<IEnumerable<DepartmentDto>>(
            await db.Departments
                .OrderBy(x => x.Title)
                .ToListAsync());

        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByID(int id)
    {
        var obj = mapper.Map<DepartmentDto>(
            await db.Departments
                .SingleOrDefaultAsync(x => x.ID == id));

        if (obj == null)
            throw new NotFoundException("Department not found!");

        return Ok(obj);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] DepartmentDto dto)
    {
        var obj = mapper.Map<Department>(dto);

        db.Departments.Add(obj);

        await db.SaveChangesAsync();

        return Ok(mapper.Map<DepartmentDto>(obj));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] DepartmentDto dto)
    {
        var obj = await db.Departments
            .SingleOrDefaultAsync(x => x.ID == id);

        if (obj == null)
            throw new NotFoundException("Department not found!");

        obj.Title = dto.Title;

        await db.SaveChangesAsync();

        return Ok(mapper.Map<DepartmentDto>(obj));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var obj = await db.Departments
            .SingleOrDefaultAsync(x => x.ID == id);

        if (obj == null)
            throw new NotFoundException("Department not found!");

        db.Departments.Remove(obj);

        await db.SaveChangesAsync();

        return Ok();
    }
}