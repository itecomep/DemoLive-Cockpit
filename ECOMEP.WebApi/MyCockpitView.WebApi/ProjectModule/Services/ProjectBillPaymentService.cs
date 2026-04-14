
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services;

public interface IProjectBillPaymentService : IBaseEntityService<ProjectBillPayment>
{
}

public class ProjectBillPaymentService : BaseEntityService<ProjectBillPayment>, IProjectBillPaymentService
{
    public ProjectBillPaymentService(EntitiesContext db) : base(db) { }


  
}