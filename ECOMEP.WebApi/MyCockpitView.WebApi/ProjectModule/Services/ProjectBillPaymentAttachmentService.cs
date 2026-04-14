using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services;
public interface IProjectBillPaymentAttachmentService : IBaseAttachmentService<ProjectBillPaymentAttachment>
{
}

public class ProjectBillPaymentAttachmentService : BaseAttachmentService<ProjectBillPaymentAttachment>, IProjectBillPaymentAttachmentService
{

    public ProjectBillPaymentAttachmentService(EntitiesContext db) : base(db)
    {
    }

}