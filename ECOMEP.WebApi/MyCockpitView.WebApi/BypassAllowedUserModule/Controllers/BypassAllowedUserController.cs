using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.BypassAllowedUserModule.Dtos;

namespace MyCockpitView.WebApi.BypassAllowedUserModule.Controllers
{
    [ApiController]
    [Route("api/bypass-allowed-user")]
    public class BypassAllowedUserController : ControllerBase
    {
        private readonly EntitiesContext _context;

        public BypassAllowedUserController(EntitiesContext context)
        {
            _context = context;
        }

        // GET all
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.BypassAllowedUsers
            .OrderByDescending(x => x.CreatedAt)
            .Select(u => new 
            {
                u.ID,
                u.Username,
                u.IsActive,
                u.CreatedAt
            })
            .ToListAsync();

            return Ok(users);
        }

        // ADD
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] BypassAllowedUserDto dto)
        {
            if (await _context.BypassAllowedUsers.AnyAsync(x => x.Username == dto.Username))
                return BadRequest(new { message = "Username already exists" });

            var entity = new BypassAllowedUser
            {
                Username = dto.Username,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.BypassAllowedUsers.Add(entity);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message, inner = ex.InnerException?.Message });
            }

            return Ok(entity);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BypassAllowedUserDto dto)
        {
            var entity = await _context.BypassAllowedUsers.FindAsync(id);
            if (entity == null)
                return NotFound();

            if (await _context.BypassAllowedUsers
                .AnyAsync(x => x.Username == dto.Username && x.ID != id))
                return BadRequest("Username already exists");

            entity.Username = dto.Username;
            entity.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(entity);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var rows = await _context.BypassAllowedUsers
                .IgnoreQueryFilters()
                .Where(x => x.ID == id)
                .ExecuteDeleteAsync();

            if (rows == 0)
                return NotFound();

            return Ok(new { message = "Deleted successfully" });
        }

        [HttpGet("contacts")]
        public async Task<IActionResult> GetContactsForBypass()
        {
            if (_context.Contacts == null)
                return BadRequest("Contacts table is not available");

            var users = await _context.Contacts
                .Where(x => !string.IsNullOrEmpty(x.Username))
                .Select(x => new BypassAllowedUserContactDto
                {
                    Id = x.ID,
                    Username = x.Username
                })
                .OrderBy(x => x.Username)
                .ToListAsync();

            return Ok(users);
        }

    }
}
