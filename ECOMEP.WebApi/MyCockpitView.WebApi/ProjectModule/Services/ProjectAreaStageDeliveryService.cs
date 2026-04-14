using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services
{
    public interface IProjectAreaStageDeliveryService : IBaseEntityService<ProjectAreaStageDelivery>
    {
       
    }
    public class ProjectAreaStageDeliveryService : BaseEntityService<ProjectAreaStageDelivery>, IProjectAreaStageDeliveryService
    {
        public ProjectAreaStageDeliveryService(EntitiesContext db) : base(db)
        {
        }

        public async Task<ProjectAreaStageDelivery> GetById(int Id)
        {
            var query = await db.ProjectAreaStageDeliveries.AsNoTracking()
                 .SingleOrDefaultAsync(i => i.ID == Id);

            return query;
        }

        public async Task<int> Create(ProjectAreaStageDelivery Entity)
        {
            if (Entity == null) throw new BadRequestException($"{nameof(Entity)}");
            await db.ProjectAreaStageDeliveries.AddAsync(Entity);
            db.SaveChanges();

            return Entity.ID;
        }

        public async Task<ProjectAreaStageDelivery> Update(int id, ProjectAreaStageDelivery Entity)
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
            var results = await db.Set<ProjectAreaStageDelivery>().FindAsync(Id);

            if (results == null)
            {
                throw new BadRequestException("Entity not found");
            }

            db.Set<ProjectAreaStageDelivery>().Remove(results);
            await db.SaveChangesAsync();
        }
    }
}
