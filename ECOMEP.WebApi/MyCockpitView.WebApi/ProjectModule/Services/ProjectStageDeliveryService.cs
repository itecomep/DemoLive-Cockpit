using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services
{
    public interface IProjectStageDeliveryService : IBaseEntityService<ProjectStageDelivery>
    {
       
    }
    public class ProjectStageDeliveryService : BaseEntityService<ProjectStageDelivery>, IProjectStageDeliveryService
    {
        public ProjectStageDeliveryService(EntitiesContext db) : base(db)
        {
        }

        public async Task<ProjectStageDelivery> GetById(int Id)
        {
            var query = await db.ProjectStageDeliveries.AsNoTracking()
                 .SingleOrDefaultAsync(i => i.ID == Id);

            return query;
        }

        public async Task<int> Create(ProjectStageDelivery Entity)
        {
            if (Entity == null) throw new BadRequestException($"{nameof(Entity)}");
            await db.ProjectStageDeliveries.AddAsync(Entity);
            db.SaveChanges();

            return Entity.ID;
        }

        public async Task<ProjectStageDelivery> Update(int id, ProjectStageDelivery Entity)
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
            var results = await db.Set<ProjectStageDelivery>().FindAsync(Id);

            if (results == null)
            {
                throw new BadRequestException("Entity not found");
            }

            db.Set<ProjectStageDelivery>().Remove(results);
            await db.SaveChangesAsync();
        }
    }
}
