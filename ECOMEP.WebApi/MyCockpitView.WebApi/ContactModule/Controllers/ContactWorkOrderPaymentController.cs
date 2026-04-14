using AutoMapper;
using MyCockpitView.WebApi.ContactModule.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ActivityModule;


using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Responses;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ContactWorkOrderPaymentController : ControllerBase
    {

        ILogger<ContactWorkOrderPaymentController> logger;
        private readonly IContactWorkOrderPaymentService service;
        private readonly IMapper mapper;
        private readonly IActivityService activityService;
        private readonly IContactService contactService;
        private readonly EntitiesContext db;
        private readonly ICurrentUserService _currentUserService;

        public ContactWorkOrderPaymentController(
            ILogger<ContactWorkOrderPaymentController> logger,
            EntitiesContext entitiesContext,
            IMapper mapper,
            IContactWorkOrderPaymentService service,
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

            var results = mapper.Map<IEnumerable<ContactWorkOrderPaymentDto>>(await query.ToListAsync());
            return Ok(results);

        }


        // GET: api/Contacts/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var results = mapper.Map<ContactWorkOrderPaymentDto>(await service.Get()
                .Include(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(ContactWorkOrderPayment)} not found!");


            return Ok(results);

        }

        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var results = mapper.Map<ContactWorkOrderPaymentDto>(await service.Get()
                .Include(x => x.Attachments).SingleOrDefaultAsync(x => x.UID == id));

            if (results == null) throw new NotFoundException($"{nameof(ContactWorkOrder)} not found!");


            return Ok(results);

        }


        [Authorize]
        [HttpGet("Pages")]
        public async Task<IActionResult> GetPages(int page = 0, int pageSize = 10, string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort)
            .Include(x => x.Attachments);
            ;
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((decimal)totalCount / pageSize);

            var results = mapper.Map<IEnumerable<ContactWorkOrderPaymentDto>>(await query
                .Skip(pageSize * page)
                .Take(pageSize).ToListAsync());

            return Ok(new PagedResponse<ContactWorkOrderPaymentDto>(results, totalCount, totalPages));

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ContactWorkOrderPaymentDto Dto)
        {
            var username = _currentUserService.GetCurrentUsername();
            var contact = await db.Contacts.AsNoTracking().Where(x => !x.IsDeleted)
                     .FirstOrDefaultAsync(x => x.Username == username);

            if (contact == null) throw new BadRequestException("Contact not found");

            var entity = mapper.Map<ContactWorkOrderPayment>(Dto);
            var id = await service.Create(entity);

            var results = mapper.Map<ContactWorkOrderPaymentDto>(await service.Get()

                .Include(x => x.Attachments)
                .SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new BadRequestException($"{nameof(ContactWorkOrderPayment)} could not be created!");

            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Contact), contact.ID,
                                                                            contact.FullName,
                                                                            $"{nameof(ContactWorkOrderPayment)} | {ClockTools.GetIST(results.Created).ToString("dd MMM yyyy HH:mm")}",
                                                                            "Created"
                                                                            );
                }
            }

            return Ok(results);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ContactWorkOrderPaymentDto Dto)
        {
            var username = _currentUserService.GetCurrentUsername();
            var contact = await db.Contacts.AsNoTracking().Where(x => !x.IsDeleted)
                     .FirstOrDefaultAsync(x => x.Username == username);

            if (contact == null) throw new BadRequestException("contact not found");

            await service.Update(mapper.Map<ContactWorkOrderPayment>(Dto));

            var results = mapper.Map<ContactWorkOrderPaymentDto>(await service.Get()
               .Include(x => x.Attachments).SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(ContactWorkOrderPayment)} not found!");

            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Contact), contact.ID,
                                                                        contact.FullName,
                                                                   $"{nameof(ContactWorkOrderPayment)} | {ClockTools.GetIST(results.Created).ToString("dd MMM yyyy HH:mm")}",
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


            var results = mapper.Map<ContactWorkOrderPaymentDto>(await service.Get().SingleOrDefaultAsync(x => x.ID == id));

            if (results == null) throw new NotFoundException($"{nameof(ContactWorkOrderPayment)} not found!");

            var username = _currentUserService.GetCurrentUsername();
            var contact = await db.Contacts.AsNoTracking().FirstOrDefaultAsync(x => x.Username == username);
            if (contact == null) throw new BadRequestException("Contact not found");

            await service.Delete(id);
            if (!string.IsNullOrEmpty(username))
            {
                var currentContact = await contactService.Get().FirstOrDefaultAsync(x => x.Username == username);
                if (currentContact != null)
                {
                    await activityService.LogUserActivity(currentContact, nameof(Contact), contact.ID,
                                                                          contact.FullName,
                                                                        $"{nameof(ContactWorkOrderPayment)} | {ClockTools.GetIST(results.Created).ToString("dd MMM yyyy HH:mm")}",
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