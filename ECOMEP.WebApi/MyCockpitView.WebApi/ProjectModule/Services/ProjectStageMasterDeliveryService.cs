using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services
{
    public interface IProjectStagMasterDeliveryService : IBaseEntityService<ProjectStageMasterDelivery>
    {
      
    }
    public class ProjectStageMasterDeliveryService : BaseEntityService<ProjectStageMasterDelivery>, IProjectStagMasterDeliveryService
    {
        public ProjectStageMasterDeliveryService(EntitiesContext db) : base(db)
        {
        }

        public async Task<ProjectStageMasterDelivery> GetById(int Id)
        {
            var query = await db.ProjectStageMasterDeliveries.AsNoTracking()
                 .SingleOrDefaultAsync(i => i.ID == Id);

            return query;
        }

        public async Task<int> Create(ProjectStageMasterDelivery Entity)
        {
            if (Entity == null) throw new BadRequestException($"{nameof(Entity)}");
            await db.Set<ProjectStageMasterDelivery>().AddAsync(Entity);
            await db.SaveChangesAsync();
            return Entity.ID;
        }

        public async Task<ProjectStageMasterDelivery> Update(int id, ProjectStageMasterDelivery Entity)
        {
            var existingEntity = await Get().FirstOrDefaultAsync(i => i.ID == id);
            if (existingEntity == null)
            {
                throw new BadRequestException("Entity not found");
            }

            db.Entry(existingEntity).CurrentValues.SetValues(Entity);
            await db.SaveChangesAsync();
            return Entity;
        }

        public async Task Delete(int Id)
        {
            var results = await db.Set<ProjectStageMasterDelivery>().FindAsync(Id);

            if (results == null)
            {
                throw new BadRequestException("Entity not found");
            }

            db.Set<ProjectStageMasterDelivery>().Remove(results);
            await db.SaveChangesAsync();
        }
    }
}
