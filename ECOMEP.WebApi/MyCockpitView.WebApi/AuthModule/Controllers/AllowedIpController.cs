using Microsoft.AspNetCore.Mvc;
using MyCockpitView.WebApi.AuthModule.Entities;
using MyCockpitView.WebApi;
using Microsoft.EntityFrameworkCore;


namespace MyCockpitView.WebApi.AuthModule.Controllers
{
    [ApiController]
    [Route("api/admin/ip")]
    public class AllowedIpController : ControllerBase
    {
        private readonly EntitiesContext _context;

        public AllowedIpController(EntitiesContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddIp([FromBody] AllowedIpAddress model)
        {
            if (string.IsNullOrEmpty(model.IpAddress))
                return BadRequest("IP address is required");

            var ip = model.IpAddress.Trim();
            bool exists = await _context.AllowedIpAddresses.AnyAsync(x => x.IpAddress == ip);
            if (exists) return Conflict("This IP address already exists");
            
            model.IpAddress = ip;
            model.IsActive = true;
            await _context.AllowedIpAddresses.AddAsync(model);
            await _context.SaveChangesAsync();

            return Ok(new { message = "IP added successfully", ip = model.IpAddress });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteIp(int id)
        {
            var ip = await _context.AllowedIpAddresses.FindAsync(id);
            if (ip == null) return NotFound("IP not found");

            _context.AllowedIpAddresses.Remove(ip);
            await _context.SaveChangesAsync();

            return Ok(new { message = "IP deleted successfully", ip = ip.IpAddress });
        }

        [HttpGet("list")]
        public async Task<IActionResult> List()
        {
            var ips = await _context.AllowedIpAddresses
                .Where(x => x.IsActive)
                .ToListAsync();
            return Ok(ips);
        }
    }
}
