using MyCockpitView.WebApi.LeaveModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.LeaveModule.Services;

public interface IHolidayMasterService : IBaseEntityService<HolidayMaster>
{
}

public class HolidayMasterService : BaseEntityService<HolidayMaster>, IHolidayMasterService
{

    public HolidayMasterService(EntitiesContext db) : base(db)
    {
    }

}
