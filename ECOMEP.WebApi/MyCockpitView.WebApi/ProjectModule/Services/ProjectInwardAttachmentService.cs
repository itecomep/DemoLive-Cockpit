using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectInwardModule.Services;
public interface IProjectInwardAttachmentService : IBaseAttachmentService<ProjectInwardAttachment>
{
}

public class ProjectInwardAttachmentService : BaseAttachmentService<ProjectInwardAttachment>, IProjectInwardAttachmentService
{

    public ProjectInwardAttachmentService(EntitiesContext db) : base(db)
    {
    }

}