
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services;

public interface IProjectWorkOrderSegmentService : IBaseEntityService<ProjectWorkOrderSegment>
{
}

public class ProjectWorkOrderSegmentService : BaseEntityService<ProjectWorkOrderSegment>, IProjectWorkOrderSegmentService
{
    private readonly IAzureBlobService azureBlobService;

    public ProjectWorkOrderSegmentService(EntitiesContext db,IAzureBlobService azureBlobService) : base(db)
    {
        this.azureBlobService = azureBlobService;
    }
}
