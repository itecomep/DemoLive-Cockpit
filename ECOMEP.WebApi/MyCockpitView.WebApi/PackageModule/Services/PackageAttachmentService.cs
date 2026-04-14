using MyCockpitView.WebApi.PackageModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.PackageModule.Services;
public interface IPackageAttachmentService : IBaseAttachmentService<PackageAttachment>
{
}

public class PackageAttachmentService : BaseAttachmentService<PackageAttachment>, IPackageAttachmentService
{

    public PackageAttachmentService(EntitiesContext db) : base(db)
    {
    }

}