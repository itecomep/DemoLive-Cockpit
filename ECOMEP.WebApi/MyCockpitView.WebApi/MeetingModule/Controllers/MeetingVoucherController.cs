using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;

using MyCockpitView.WebApi.MeetingModule.Dtos;
using MyCockpitView.WebApi.MeetingModule.Entities;
using MyCockpitView.WebApi.MeetingModule.Services;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.MeetingModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MeetingVoucherController : ControllerBase
    {

        ILogger<MeetingVoucherController> logger;
        private readonly IMeetingVoucherService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public MeetingVoucherController(
            ILogger<MeetingVoucherController> logger,
            EntitiesContext entitiesContext,
            IMeetingVoucherService service,
            IMapper mapper,
            IActivityService activityService,
            IContactService contactService,
            ICurrentUserService currentUserService
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.service = service;
            this.mapper = mapper;
            this.activityService = activityService;
            this.contactService = contactService;
            _currentUserService = currentUserService;
        }

        [Authorize]
        [HttpGet]

        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
                .Include(x => x.Attachments);
            var results = mapper.Map<IEnumerable<MeetingVoucherDto>>(await query.ToListAsync());
            return Ok(results);

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = mapper.Map<MeetingVoucherDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(MeetingVoucher)} not found!");


            return Ok(obj);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = mapper.Map<MeetingVoucherDto>(await service.GetById(id));
            if (obj == null) return NotFound();
            if (obj == null) throw new NotFoundException($"{nameof(MeetingVoucher)} not found!");


            return Ok(obj);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<MeetingVoucherDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<MeetingVoucherDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] MeetingVoucherDto Dto)
        {
            //var _meetingVoucher = await db.MeetingVouchers.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.MeetingID);
            //if (_meetingVoucher == null) throw new BadRequestException("MeetingVoucher not found");

            var _meetingVoucher = mapper.Map<MeetingVoucherDto>(await service.GetById(await service.Create(mapper.Map<MeetingVoucher>(Dto))));
            if (_meetingVoucher == null) throw new BadRequestException($"{nameof(MeetingVoucher)} could not be created!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(MeetingVoucher), _meetingVoucher.ID,
                                                                        _meetingVoucher.ExpenseHead,
                                                                        $"{nameof(MeetingVoucher)}",
                                                                        "Created"
                                                                        );
                }
            }

            return Ok(_meetingVoucher);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MeetingVoucherDto Dto)
        {
            var meetingVoucher = await db.MeetingVouchers.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Dto.ID);
            if (meetingVoucher == null) throw new BadRequestException("MeetingVoucher not found");

            await service.Update(mapper.Map<MeetingVoucher>(Dto));

            var results = mapper.Map<MeetingVoucherDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(MeetingVoucher)} not found!");


            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(MeetingVoucher), meetingVoucher.ID,
                                                                        meetingVoucher.ExpenseHead,
                                                                        $"{nameof(MeetingVoucher)}",
                                                                        "Updated"
                                                                        );
                }
            }

            return Ok(results);

        }


        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {


            var results = mapper.Map<MeetingVoucherDto>(await service.GetById(id));
            if (results == null) throw new NotFoundException($"{nameof(MeetingVoucher)} not found!");

            var meetingVoucher = await db.MeetingVouchers.AsNoTracking().SingleOrDefaultAsync(x => x.ID == results.ID);
            if (meetingVoucher == null) throw new BadRequestException("MeetingVoucher not found");

            await service.Delete(id);

            var username = _currentUserService.GetCurrentUsername();
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(MeetingVoucher), meetingVoucher.ID,
                                                                          meetingVoucher.ExpenseHead,
                                                                          $"{nameof(MeetingVoucher)}",
                                                                          "Deleted"
                                                                          );
                }
            }
            return Ok();

        }


        [Authorize]
        [HttpGet("SearchTagOptions")]
        public async Task<IActionResult> GetSearchTagOptions()
        {
            var results = await service.GetSearchTagOptions();
            return Ok(results);
        }


    }
}