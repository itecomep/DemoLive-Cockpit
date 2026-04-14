using AutoMapper;
using MyCockpitView.WebApi.WFTaskModule.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.Utility.Common;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ActivityModule.Entities;
using MyCockpitView.WebApi.ActivityModule.Dtos;

namespace MyCockpitView.WebApi.ActivityModule;

[Route("[controller]")]
[ApiController]
public class ActivityController : ControllerBase
{
    ILogger<ActivityController> _logger;
    private readonly IActivityService _service;
    private readonly IMapper _mapper;
    private readonly EntitiesContext _entitiesContext;
    public ActivityController(
        ILogger<ActivityController> logger,
        EntitiesContext entitiesContext,
        IActivityService ActivityService,
        IMapper mapper)
    {
        _logger = logger;
        _entitiesContext = entitiesContext;
        _service = ActivityService;
        _mapper = mapper;
    }


    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Attachments);

        var results = _mapper.Map<IEnumerable<ActivityDto>>(await query
            .ToListAsync());

        var _taskIDs = results.Where(x => x.WFTaskID != null).Select(x => x.WFTaskID).ToList();
        var _taskAttachments = await _entitiesContext.WFTaskAttachments
           .AsNoTracking()
           .Where(x => !x.IsDeleted)
           .Where(x => _taskIDs.Contains(x.WFTaskID)) // Use Contains() instead of Any()
           .ToListAsync();

        //The below code was published on this date
        var _publishedDate = new DateTime(2025, 2, 14);

        foreach (var obj in results)
        {
            if (obj.WFTaskID != null && obj.Created < _publishedDate)
            {
                //obj.Attachments = _mapper.Map<List<WFTaskAttachmentDto>>(
                //    _taskAttachments.Where(x => x.WFTaskID == obj.WFTaskID.Value)
                //    .ToList());

                obj.Attachments = _taskAttachments
                    .Where(x => x.WFTaskID == obj.WFTaskID.Value)
                    .Select(x => new ActivityAttachmentDto
                    {
                        Filename = x.Filename,
                        Size = x.Size,
                        Url = x.Url,
                        ThumbUrl = x.ThumbUrl,
                        Container = x.Container,
                        ContentType = x.ContentType
                    }).ToList();
            }
        }

        return Ok(results);

    }

    [Authorize]
    [HttpGet("Pages")]
    public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
    {

        var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Attachments);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

        var results = _mapper.Map<IEnumerable<ActivityDto>>(await query
            .Skip(pageSize * page)
            .Take(pageSize).ToListAsync());

        //var _taskIDs = results.Where(x => x.WFTaskID != null).Select(x => x.WFTaskID).ToList();
        //var _taskAttachments = await _entitiesContext.WFTaskAttachments
        //    .AsNoTracking()
        //    .Where(x => !x.IsDeleted)
        //    .Where(x => _taskIDs.Any(t => t == x.WFTaskID))
        //    .ToListAsync();

        //foreach (var obj in results)
        //{
        //    if (obj.WFTaskID != null)
        //    {

        //        obj.Attachments = _mapper.Map<List<WFTaskAttachmentDto>>(
        //            _taskAttachments.Where(x => x.WFTaskID == obj.WFTaskID.Value)
        //            .ToList());

        //    }

        //}

        return Ok(new PagedResponse<ActivityDto>(results, totalCount, totalPages));

    }



    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Post([FromBody] ActivityDto Dto)
    {

        var results = _mapper.Map<ActivityDto>(await _service.GetById(await _service.Create(_mapper.Map<Activity>(Dto))));

        if (results == null) throw new BadRequestException($"{nameof(Activity)} could not be created!");

        return Ok(results);

    }


}
