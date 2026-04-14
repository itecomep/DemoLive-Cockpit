

using MyCockpitView.WebApi.WFTaskModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.WFTaskModule.Services
{
    public interface IAssessmentMasterService : IBaseEntityService<AssessmentMaster>
    {
    }
    public class AssessmentMasterService : BaseEntityService<AssessmentMaster>, IAssessmentMasterService
    {
        public AssessmentMasterService(EntitiesContext db) : base(db) { }

    }
}