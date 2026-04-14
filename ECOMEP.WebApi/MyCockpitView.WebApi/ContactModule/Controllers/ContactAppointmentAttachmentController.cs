using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.ContactModule.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ContactAppointmentAttachmentController : ControllerBase
    {
        ILogger<ContactAppointmentAttachmentController> _logger;
        private readonly IContactAppointmentAttachmentService _service;
        private readonly IMapper _mapper;
        private readonly IContactService contactService;
        private readonly EntitiesContext _db;

        public ContactAppointmentAttachmentController(
              ILogger<ContactAppointmentAttachmentController> logger,
            EntitiesContext entitiesContext,
            IContactAppointmentAttachmentService service,
            IMapper mapper,
            IContactService contactService
            )
        {
            this._logger = logger;
            this._db = entitiesContext;
            this._service = service;
            this._mapper = mapper;
            this.contactService = contactService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
        {

            var query = _service.Get(Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null, Search, Sort).Include(x => x.ContactAppointment)
              ;

            var results = _mapper.Map<IEnumerable<ContactAppointmentAttachmentDto>>(await query.ToListAsync());


            return Ok(results);

        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {

            var obj = _mapper.Map<ContactAppointmentAttachmentDto>(await _service.GetById(id));
            if (obj == null) return NotFound();


            if (obj == null) throw new NotFoundException($"{nameof(ContactAppointmentAttachment)} not found!");


            return Ok(obj);

        }

        [Authorize]
        [HttpGet("uid/{id:guid}")]
        public async Task<IActionResult> GetByGUID(Guid id)
        {

            var obj = _mapper.Map<ContactAppointmentAttachmentDto>(await _service.GetById(id));
            if (obj == null) return NotFound();

            if (obj == null) throw new NotFoundException($"{nameof(ContactAppointmentAttachment)} not found!");


            return Ok(obj);

        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] ContactAppointmentAttachmentDto Dto)
        {

            var obj = _mapper.Map<ContactAppointmentAttachmentDto>(await _service.GetById(await _service.Create(_mapper.Map<ContactAppointmentAttachment>(Dto))));
            if (obj == null) throw new BadRequestException($"{nameof(ContactAppointmentAttachment)} could not be created!");


            return Ok(obj);

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ContactAppointmentAttachmentDto Dto)
        {

            await _service.Update(_mapper.Map<ContactAppointmentAttachment>(Dto));

            var obj = _mapper.Map<ContactAppointmentAttachmentDto>(await _service.GetById(id));
            if (obj == null) throw new NotFoundException($"{nameof(ContactAppointmentAttachment)} not found!");

            return Ok(obj);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var result = _mapper.Map<ContactAppointmentAttachmentDto>(await _service.GetById(id));
            if (result == null) throw new NotFoundException($"{nameof(ContactAppointmentAttachment)} not found!");
            await _service.Delete(id);


            return Ok();

        }

        [Authorize]
        [HttpGet("FieldOptions")]
        public async Task<IActionResult> GetFeildOptions(string field)
        {
            var results = await _service.GetFieldOptions(field);
            return Ok(results);
        }

        [Authorize]
        [HttpGet("SearchTagOptions")]
        public async Task<IActionResult> GetSearchTagOptions()
        {
            var results = await _service.GetSearchTagOptions();
            return Ok(results);
        }
    }
}
