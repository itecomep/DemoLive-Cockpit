using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.ProjectModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services
{
    public interface IProjectStageMasterService : IBaseEntityService<ProjectStageMaster>
    {
      
    }
    public class ProjectStageMasterService : BaseEntityService<ProjectStageMaster>, IProjectStageMasterService
    {
        public ProjectStageMasterService(EntitiesContext db) : base(db)
        {
        }

       public async Task<ProjectStageMaster>GetById(int Id)
       {
            var query = await db.ProjectStageMasters.AsNoTracking()
                 .Include(x => x.Deliveries)
                 .SingleOrDefaultAsync(i => i.ID == Id);

            return query;
       }

        public async Task<int> Create(ProjectStageMaster Entity)
        {
            if (Entity == null) throw new BadRequestException($"{nameof(Entity)}");
            await db.Set<ProjectStageMaster>().AddAsync(Entity);
            await db.SaveChangesAsync();
            return Entity.ID;
        }

        public async Task<ProjectStageMaster> Update(int id, ProjectStageMaster Entity)
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
            var results = await db.Set<ProjectStageMaster>().FindAsync(Id);

            if (results == null)
            {
                throw new BadRequestException("Entity not found");
            }

            db.Set<ProjectStageMaster>().Remove(results);
            await db.SaveChangesAsync();
        }
    }
}
