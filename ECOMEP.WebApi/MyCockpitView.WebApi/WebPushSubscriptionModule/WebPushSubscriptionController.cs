
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.ContactModule.Entities;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.WFTaskModule.Entities;

namespace MyCockpitView.WebApi.WebPushSubscriptionModule
{
    [Route("[controller]")]
    [ApiController]
    public class WebPushSubscriptionController : ControllerBase
    {

        ILogger<WebPushSubscriptionController> logger;
        private readonly EntitiesContext db;
        private readonly ISharedService sharedService;

        public WebPushSubscriptionController(
            ILogger<WebPushSubscriptionController> logger,
            EntitiesContext entitiesContext,
            ISharedService sharedService
            )
        {
            this.logger = logger;
            db = entitiesContext;
            this.sharedService = sharedService;
        }
        [Authorize]
        [HttpGet]

        public async Task<IActionResult> Get()
        {
                return Ok(await db.WebPushSubscriptions.AsNoTracking().ToListAsync());
        }

        [Authorize]
        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetByUsername(string username)
        {

                return Ok(
                    await db.WebPushSubscriptions.AsNoTracking()
                    .Where(x => x.Username == username)
                    .ToListAsync()
                    );
        }

        //[Authorize]
        [HttpGet("SendTest/{username}")]
        public async Task<IActionResult> TestByUsername(string username)
        {

            await sharedService.PushNotification(username,
                    $"TEST NOTIFICATION",
                    $"Hello {username}. Welcome to MyCockpitView",
                    "Powered By","Newarch Infotech LLP"
                );
            return Ok( );
        }

        [Authorize]
        [HttpDelete("username/{username}")]
        public async Task<IActionResult> DeleteByUsername(string username)
        {
                var items = await db.WebPushSubscriptions.AsNoTracking()
                  .Where(x => x.Username == username)
                  .ToListAsync();

                db.WebPushSubscriptions.RemoveRange(items);
                await db.SaveChangesAsync();

                return Ok();
        }

        [Authorize]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetByID(Guid id)
        {
           
                return Ok(
                   await db.WebPushSubscriptions.AsNoTracking()
                   .SingleOrDefaultAsync(x => x.Id == id)
                   );
           
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody] WebPushSubscription Model)
        {
            
                var exist = await db.WebPushSubscriptions.Where(x => x.Username == Model.Username)
                    .Where(x => x.OS == Model.OS && x.Browser == Model.Browser && x.Device == Model.Device && x.DeviceType == Model.DeviceType)
                    .ToListAsync();

                if (exist.Any())
                {
                    db.WebPushSubscriptions.RemoveRange(exist);
                }

                db.WebPushSubscriptions.Add(Model);
                await db.SaveChangesAsync();

                return Ok(Model);
          
        }

        [Authorize]
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] WebPushSubscription Model)
        {

            if (Model.Id != id) return BadRequest("id not matching with model!");

                db.Entry(Model).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return Ok();
          
        }

        [Authorize]
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
           
                var Model = await db.WebPushSubscriptions.FindAsync(id);
            if (Model == null) return BadRequest("Object not found!");
                db.WebPushSubscriptions.Remove(Model);
                await db.SaveChangesAsync();
                return Ok();

        }

    }
}