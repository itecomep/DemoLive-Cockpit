using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.AuthModule.Services;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Responses;

namespace MyCockpitView.WebApi.AuthModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginSessionController : ControllerBase
    {

        ILogger<LoginSessionController> logger;
        private readonly ILoginSessionService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly EntitiesContext db;
        public LoginSessionController(
            ILogger<LoginSessionController> logger,
            EntitiesContext entitiesContext,
            ILoginSessionService service,
            IMapper mapper,
            IActivityService activityService)
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
        }

        [Authorize]
        [HttpGet]

        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {
            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            var results = await query.ToListAsync();
            return Ok(results);
        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = await service.GetById(id);

            if (results == null) throw new NotFoundException($"{nameof(LoginSession)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = await service.GetById(id);

            if (results == null) throw new NotFoundException($"{nameof(LoginSession)} not found!");


            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync();

            return Ok(new PagedResponse<LoginSession>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] LoginSession Dto)
        {

            var results = await service.GetById(await service.Create(Dto));
            if (results == null) throw new BadRequestException($"{nameof(LoginSession)} could not be created!");


            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LoginSession Dto)
        {

            await service.Update(Dto);

            var results = await service.GetById(id);

            if (results == null) throw new NotFoundException($"{nameof(LoginSession)} not found!");

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = await service.GetById(id);
            if (results == null) throw new NotFoundException($"{nameof(LoginSession)} not found!");

            await service.Delete(id);

            return Ok();

        }


        [Authorize]
        [HttpGet("SearchTagOptions")]
        public async Task<IActionResult> GetSearchTagOptions()
        {
            var results = await service.GetSearchTagOptions();
            return Ok(results);
        }


        //Azure Function App
        [HttpGet]
        [Route("CloseExpiredSessions")]
        public async Task<IActionResult> CloseExpiredSessions()
        {
            
                await service.CloseExpiredSessions();

                return Ok();
            
        }

    }
}