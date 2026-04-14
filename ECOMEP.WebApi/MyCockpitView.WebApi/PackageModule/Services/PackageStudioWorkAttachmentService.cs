using MyCockpitView.WebApi.PackageModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.PackageModule.Services;
public interface IPackageStudioWorkAttachmentService : IBaseAttachmentService<PackageStudioWorkAttachment>
{
}

public class PackageStudioWorkAttachmentService : BaseAttachmentService<PackageStudioWorkAttachment>, IPackageStudioWorkAttachmentService
{

    public PackageStudioWorkAttachmentService(EntitiesContext db) : base(db)
    {
    }


}