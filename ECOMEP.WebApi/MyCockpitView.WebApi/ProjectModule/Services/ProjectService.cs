using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.Utility.Excel;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.ProjectModule.Dtos;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.WorkOrderModule.Entities;
using MyCockpitView.WebApi.WorkOrderModule.Services;
using System.Data;
using static MyCockpitView.WebApi.ProjectModule.Services.ProjectService;

namespace MyCockpitView.WebApi.ProjectModule.Services;

public interface IProjectService : IBaseEntityService<Project>
{
    Task<bool> Exist(string title);
    Task<IEnumerable<ProjectAnalysis>> GetAnalysisData(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
    Task<byte[]> GetAnalysisExcel(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
    Task<string> GetCode(int ID);
    Task<ProjectCode> GetNewCode(int companyID, int? ParentID = null, DateTime? created = null);
    Task<IEnumerable<ProjectStageAnalysisDto>> GetProjectStageAnalysis(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
    Task RegenerateCodes();
    Task SyncStages();
    Task GenerateWorkOrderStageandBillingData();
    Task<List<Project>> GetRTProject();
}

public class ProjectService : BaseEntityService<Project>, IProjectService
{
    public async Task<List<Project>> GetRTProject()
    {
        var days = 0;

        var total = await db.AppSettingMasters.Where(x => x.PresetKey == McvConstant.REQUEST_TICKET_PROJECT_BILLING_WINDOW)
            .Select(x => x.PresetValue)
            .FirstOrDefaultAsync();

        if (int.TryParse(total, out var parsedDays))
        {
            days = parsedDays;
        }
        var cutoff = DateTime.UtcNow.AddDays(-days);


        var _project = await db.Projects
            .AsNoTracking()
            .Where(p => p.StatusFlag == 2 || p.StatusFlag == 1 && (
                        !p.Bills.Any() // Include projects with no bills
                        || (
                            p.Bills
                             .Where(b => b.StatusFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE)
                             .OrderByDescending(b => b.ProformaDate)
                             .FirstOrDefault() != null
                            && p.Bills
                                 .Where(b => b.StatusFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE)
                                 .Max(b => b.ProformaDate) >= cutoff
                        )
                    ))
            .Include(x => x.Bills)
            .ToListAsync();

        // Break the circular reference by setting navigation properties to null
        foreach (var project in _project) //loop through each project
        {
            if (project.Bills != null) //check if project has bills
            {
                foreach (var bill in project.Bills) //loop through each bill
                {
                    bill.Project = null; // Break circular refrence
                }
            }
        }
        return _project;
    }

    public ProjectService(EntitiesContext db) : base(db) { }

    public IQueryable<Project> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<Project> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {
            if (Filters.Where(x => x.Key.Equals("title", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("title", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Title == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("segment", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("segment", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Segment == _item.Value);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("typology", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("typology", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Typology == _item.Value);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("ProjectPartnerContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectPartnerContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Associations.Where(a => a.TypeFlag == 0 && a.ContactID == isNumeric).Any());
                }
                _query = _query.Include(x => x.Associations).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("ProjectAssociateContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectAssociateContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Associations.Where(a => a.TypeFlag == 1 && a.ContactID == isNumeric).Any());
                }
                _query = _query.Include(x => x.Associations).Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("ProjectPartnerOrAssociateContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectPartnerOrAssociateContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Associations.Where(a => (a.TypeFlag == 1 || a.TypeFlag == 0) && a.ContactID == isNumeric).Any());
                }
                _query = _query.Include(x => x.Associations).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("companyID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("companyID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.CompanyID == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<Project>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Teams.Any(t => t.ContactTeamID == isNumeric));
                }
                _query = _query.Include(x => x.Teams).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("CreatedRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("CreatedRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.Created >= result);
            }

            if (Filters.Where(x => x.Key.Equals("CreatedRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("CreatedRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.Created < end);

            }


            if (Filters.Where(x => x.Key.Equals("ModifiedRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("ModifiedRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.Modified >= result);
            }

            if (Filters.Where(x => x.Key.Equals("ModifiedRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("ModifiedRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.Modified < end);

            }

            if (Filters.Where(x => x.Key.Equals("ConvertedRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("ConvertedRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.InquiryConvertionDate != null && x.InquiryConvertionDate.Value >= result);
            }

            if (Filters.Where(x => x.Key.Equals("ConvertedRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("ConvertedRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.InquiryConvertionDate != null && x.InquiryConvertionDate.Value < end);

            }
        }

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x.Title.ToLower().Contains(_key)
                                || x.Code.Contains(_key)
                                || x._searchTags.ToLower().Contains(_key)
                        );

        }

        if (Sort != null && Sort != string.Empty)
        {
            var _orderedQuery = _query.OrderBy(l => 0);
            var keywords = Sort.Replace("asc", "").Split(',');

            foreach (var key in keywords)
            {
                if (key.Trim().Equals("created", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.Created);

                else if (key.Trim().Equals("created desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.Created);

                else if (key.Trim().Equals("modified", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.Modified);

                else if (key.Trim().Equals("modified desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.Modified);

                else if (key.Trim().Equals("ExpectedCompletionDate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.ExpectedCompletionDate);

                else if (key.Trim().Equals("ExpectedCompletionDate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.ExpectedCompletionDate);

                else if (key.Trim().Equals("ExpectedCompletionDate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.ExpectedCompletionDate);

                else if (key.Trim().Equals("ContractCompletionDate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.ContractCompletionDate);

                else if (key.Trim().Equals("ContractCompletionDate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.ContractCompletionDate);

                else if (key.Trim().Equals("InquiryConvertionDate desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.InquiryConvertionDate);

                else if (key.Trim().Equals("InquiryConvertionDate", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.InquiryConvertionDate);


                else if (key.Trim().Equals("code desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.Code);

                else if (key.Trim().Equals("code", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.Code);
            }

            return _orderedQuery;
        }

        return _query
                      .OrderBy(x => x.Code);

    }


    public async Task<Project> GetById(int Id)
    {

        return await Get()
            .Include(x => x.ClientContact)
            .Include(x => x.ProjectManagerContact)
            .Include(x => x.AssistantProjectManagerContact)
            .Include(x => x.GroupContact)
            .Include(x => x.ReferredByContact)
            .Include(x => x.GroupCompanyContact)
        .Include(x => x.Associations).ThenInclude(c => c.Contact)
        .Include(x => x.Attachments)
        .Include(x => x.Company)
        .SingleOrDefaultAsync(x => x.ID == Id);

    }

    public async Task<Project> GetById(Guid Id)
    {

        return await Get()
                            .Include(x => x.ClientContact)
                            .Include(x => x.ProjectManagerContact)
                            .Include(x => x.GroupContact)
                            .Include(x => x.GroupCompanyContact)
                            .Include(x => x.AssistantProjectManagerContact)
            .Include(x => x.ReferredByContact)
        .Include(x => x.Associations).ThenInclude(c => c.Contact)
        .Include(x => x.Attachments)
        .Include(x => x.Company)
        .SingleOrDefaultAsync(x => x.UID == Id);

    }


    public async Task<bool> Exist(string title)
    {

        return await Get().AnyAsync(x => x.BillingTitle.ToLower() == title.ToLower()
            || x.Title.ToLower() == title.ToLower());

    }


    public async Task<ProjectCode> GetNewCode(int companyID, int? ParentID = null, DateTime? createdDate = null)
    {

        //var companyService = new CompanyService(db);
        //    var _company = await companyService.Get()
        //    .SingleOrDefaultAsync(x => x.ID == companyID);

        //    if (_company == null) throw new Exception("Company not found. Please select a company and try again!");

        //var fYearStart = ClockTools.GetFinancialYearStart(createdDate);

        //var query = db.Projects.AsNoTracking()// non deleted
        //    .Where(x => x.Created > fYearStart);

        //var order= await query.AnyAsync() ? await query.Where(x => x.OrderFlag > 0).MaxAsync(x => x.OrderFlag) + 1 : 101;

        //return new ProjectCode
        //{
        //    Order=order,
        //    Code = $"{_company.OrderFlag.ToString("0")}{ClockTools.GetFinancialYearStart(createdDate).ToString("yy")}{order.ToString("000")}"
        //};

        if (ParentID != null)
        {

            var parent = await Get()
                .Select(x => new
                {
                    x.ID,
                    x.OrderFlag

                })
                .SingleOrDefaultAsync(x => x.ID == ParentID);

            if (parent != null)
            {
                var lastChild = await Get()
                    .Where(x => x.ParentID == ParentID)
                    .OrderByDescending(x => x.Created)
                .CountAsync();

                return new ProjectCode
                {
                    Order = parent.OrderFlag,
                    Code = $"{parent.OrderFlag}({DataTools.GetAplahbet(lastChild)})"
                };
            }
        }

        var order = await Get().AnyAsync() ?
            await Get().MaxAsync(x => x.OrderFlag) + 1 :
            1;

        return new ProjectCode
        {
            Order = order,
            //Code=$"{_company.Initials}{fYearStart.ToString("yy")}{(order).ToString("00")}" 
            Code = $"{order}"
        };

    }


    public async Task<int> Create(Project Entity)
    {



        Entity.BillingTitle = Entity.BillingTitle == null || Entity.BillingTitle == string.Empty ? Entity.Title : Entity.BillingTitle;

        Entity.Title = Entity.Title.ToUpper().Trim();
        Entity.BillingTitle = Entity.BillingTitle.ToUpper().Trim();

        var _company = await db.Companies.AsNoTracking().SingleOrDefaultAsync(x => x.ID == Entity.CompanyID);
        if (_company == null) throw new Exception("Company not selected. Please select a company and try again!");

        //var code= await GetNewCode(_company.ID,Entity.ParentID,DateTime.UtcNow);
        //Entity.OrderFlag = code.Order;
        //Entity.Code = code.Code;

        //  var masterStages = await db.ProjectStageMasters.AsNoTracking()
        //.Where(x => !x.IsDeleted)
        //.Where(x => x.Typology == Entity.Typology)
        //.ToListAsync();

        //  Entity.Stages.Clear();
        //  foreach (var item in masterStages)
        //  {
        //      Entity.Stages.Add(new ProjectStage
        //      {
        //          Title = item.Title,
        //          Percentage = item.Percentage,
        //          TypeFlag = item.TypeFlag,
        //          OrderFlag=item.OrderFlag
        //      });
        //  }

        //Entity.CompanyID = 1;
        return await base.Create(Entity);

    }

    public async Task Update(Project UpdatedEntity)
    {

        var Entity = await db.Projects.AsNoTracking()
            .SingleOrDefaultAsync(x => x.ID == UpdatedEntity.ID);

        if (Entity == null) throw new Exception("Project not found");

        //if (UpdatedEntity.CompanyID != Entity.CompanyID)
        //{
        //    //Update the company code in project code
        //    var result = await GetNewCode(Entity.CompanyID.Value, Entity.ParentID, Entity.Created);

        //    Entity.OrderFlag = result.Order;
        //    Entity.Code = result.Code;
        //}
        //if (UpdatedEntity.CompanyID != Entity.CompanyID)
        //{
        //    //Update the company code in project code
        //    //var code = await GetNewCode(UpdatedEntity.CompanyID.Value, Entity.Created);
        //    var companyService = new CompanyService(db);
        //    var _company = await companyService.Get()
        //    .SingleOrDefaultAsync(x => x.ID == UpdatedEntity.CompanyID);

        //    if (_company == null) throw new Exception("Company not found. Please select a company and try again!");

        //    var fYearStart = ClockTools.GetFinancialYearStart(Entity.Created);

        //    UpdatedEntity.Code = $"{_company.OrderFlag.ToString("0")}{ClockTools.GetFinancialYearStart(fYearStart).ToString("yy")}{Entity.OrderFlag.ToString("000")}";
        //}
        // if (UpdatedEntity.Typology != Entity.Typology)
        // {
        //     var projectStages = await db.ProjectStages.AsNoTracking()
        //         .Where(x => !x.IsDeleted && x.ProjectID == Entity.ID)
        //         .ToListAsync();

        //     var masterStages = await db.ProjectStageMasters.AsNoTracking()
        //.Where(x => !x.IsDeleted)
        //.Where(x => x.Typology == UpdatedEntity.Typology)
        //.ToListAsync();

        //     foreach (var stage in projectStages)
        //     {
        //         if (stage.StatusFlag == 1) continue;

        //         var exist = masterStages.FirstOrDefault(x => x.Title == stage.Title);
        //         if (exist == null)
        //         {
        //             db.Entry(stage).State = EntityState.Deleted;
        //         }
        //         else
        //         {
        //             stage.Percentage = exist.Percentage;
        //             db.Entry(stage).State = EntityState.Modified;
        //         }
        //     }
        //     foreach (var item in masterStages)
        //     {
        //         if (!projectStages.Any(x => x.Title == item.Title))
        //         {
        //             db.ProjectStages.Add(new ProjectStage
        //             {
        //                 ProjectID = UpdatedEntity.ID,
        //                 Title = item.Title,
        //                 Percentage = item.Percentage,
        //                 TypeFlag = item.TypeFlag,
        //                 OrderFlag=item.OrderFlag
        //             });
        //         }
        //     }
        // }

        Entity = UpdatedEntity;

        await base.Update(Entity);
    }

    public async Task<string> GetCode(int ID)
    {
        var entity = await db.Projects.AsNoTracking().SingleOrDefaultAsync(x => x.ID == ID);
        if (entity == null) return null;

        return entity.Code;
    }

    public async Task<IEnumerable<ProjectAnalysis>> GetAnalysisData(
     IEnumerable<QueryFilter> Filters = null,
     string Search = null,
     string Sort = null
     )
    {

        var todoData = db.Todos
                        .Where(x => !x.IsDeleted)
                        .Where(x => x.StatusFlag == McvConstant.TODO_STATUSFLAG_COMPLETED)
                        .Where(x => x.ProjectID != null)
             .Join(db.WFTasks
        .Where(x => x.Entity == nameof(Todo))
        .Where(x => x.StatusFlag == McvConstant.WFTASK_STATUSFLAG_COMPLETED)
        .GroupBy(x => x.EntityID)
             .Select(x => new
             {
                 TodoID = x.Key,
                 MhrAssigned = x.Sum(s => s.MHrAssigned),
                 MHrConsumed = x.Sum(s => s.MHrConsumed),
                 MHrAssessed = x.Sum(s => s.MHrAssessed),
                 AverageAssessmentPoints = x.Average(s => s.AssessmentPoints)
             }),
                        todo => todo.ID,
                        task => task.TodoID,
                        (todo, task) => new { todo, task })

            .GroupBy(x => x.todo.ProjectID)
             .Select(x => new
             {
                 ProjectID = x.Key,
                 MhrAssigned = x.Sum(s => s.todo.MHrAssigned),
                 MHrConsumed = x.Sum(s => s.task.MHrConsumed),
                 MHrAssessed = x.Sum(s => s.task.MHrAssessed),
                 AverageAssessmentPoints = x.Average(s => s.task.AverageAssessmentPoints)
             });

        var _projectData = Get(Filters)
            .Include(x => x.ClientContact)
            .Include(x => x.ReferredByContact)
            .Include(x => x.GroupCompanyContact)
            .Include(x => x.ProjectManagerContact)
            .Include(x => x.AssistantProjectManagerContact)
            .Include(x => x.GroupContact)
            .Include(x => x.Company)
                            .Select(x => new ProjectAnalysis
                            {
                                ID = x.ID,
                                UID = x.UID,
                                Title = x.Title,
                                Code = x.Code,
                                Created = x.Created,
                                Modified = x.Modified,
                                ExpectedCompletionDate = x.ExpectedCompletionDate,
                                ExpectedMHr = x.ExpectedMHr,

                                City = x.City != null ? x.City : "",
                                State = x.State != null ? x.State : "",
                                Country = x.Country != null ? x.Country : "",
                                Location = x.Location != null ? x.Location : "",
                                Client = x.ClientContact != null ? x.ClientContact.FullName : "",
                                ReferredBy = x.ReferredByContact != null ? x.ReferredByContact.FullName : "",
                                Segment = x.Segment,

                                Fee = x.Fee,
                                Company = x.Company.Title,
                                StatusFlag = x.StatusFlag,
                                Status = db.StatusMasters.Where(s => s.Entity != null && s.Entity == nameof(Project) && s.Value == x.StatusFlag).Any() ?
                              db.StatusMasters.Where(s => s.Entity != null && s.Entity == nameof(Project) && s.Value == x.StatusFlag).FirstOrDefault().Title : "UNDEFINED",

                                AssignedMHr = todoData.Any(t => t.ProjectID == x.ID) ? todoData.FirstOrDefault(t => t.ProjectID == x.ID).MhrAssigned : 0,
                                ConsumedMHr = todoData.Any(t => t.ProjectID == x.ID) ? todoData.FirstOrDefault(t => t.ProjectID == x.ID).MHrConsumed : 0,
                                AssessedMHr = todoData.Any(t => t.ProjectID == x.ID) ? todoData.FirstOrDefault(t => t.ProjectID == x.ID).MHrAssessed : 0,
                                AverageAssessmentPoints = todoData.Any(t => t.ProjectID == x.ID) ? todoData.FirstOrDefault(t => t.ProjectID == x.ID).AverageAssessmentPoints : 0
                            });

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _projectData = _projectData.Where(x => x.Title.ToLower().Contains(_key)
                         || x.Location.ToLower().Contains(_key)
                         || (x.City != null ? x.City.ToLower().Contains(_key) : false)
                        || (x.State != null ? x.State.ToLower().Contains(_key) : false)
                         || (x.Country != null ? x.Country.ToLower().Contains(_key) : false)
                        || x.Code.Contains(_key)
                        || x.Client.ToLower().Contains(_key)
                        || x.ReferredBy.ToLower().Contains(_key)
                        );

        }

        var _results = await _projectData.ToListAsync();




        if (Sort != null && Sort != string.Empty)
        {
            var _orderedQuery = _results.OrderBy(l => 0);
            var keywords = Sort.Replace("asc", "").Split(',');

            foreach (var key in keywords)
            {
                if (key.Trim().Equals("Code", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.Code);
                else if (key.Trim().Equals("Code desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.Code);
                else if (key.Trim().Equals("Created", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenBy(x => x.Created);
                else if (key.Trim().Equals("Created desc", StringComparison.OrdinalIgnoreCase))
                    _orderedQuery = _orderedQuery
                            .ThenByDescending(x => x.Created);

            }

            return _orderedQuery;
        }

        return _results;

    }


    public async Task<byte[]> GetAnalysisExcel(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        var _dataSet = new DataSet();

        var _data = await GetAnalysisData(Filters, Search, Sort);
        foreach (var item in _data)
        {
            item.Created = ClockTools.GetIST(item.Created);
            item.Modified = ClockTools.GetIST(item.Modified);
            item.ExpectedCompletionDate = item.ExpectedCompletionDate != null ? ClockTools.GetIST(item.ExpectedCompletionDate.Value) : null;
        }
        _dataSet.Tables.Add(DataTools.ToDataTable(_data));

        return ExcelUtility.ExportExcel(_dataSet);

    }

    public async Task SyncStages()
    {

        var projects = await Get()
            .Where(x =>
             //x.StatusFlag != McvConstant.PROJECT_STATUSFLAG_DISCARD
             //&& x.StatusFlag != McvConstant.PROJECT_STATUSFLAG_LOST
             x.StatusFlag != McvConstant.PROJECT_STATUSFLAG_ONHOLD
            && x.StatusFlag != McvConstant.PROJECT_STATUSFLAG_COMPLETED)
            .Select(x => new
            {
                x.ID,
                x.Typology
            })
            .ToListAsync();

        var masterStages = await db.ProjectStageMasters.AsNoTracking()
      .Where(x => !x.IsDeleted)
      //.Where(x => x.Typology == UpdatedEntity.Typology)
      .ToListAsync();

        foreach (var project in projects)
        {
            var projectStages = await db.ProjectStages.AsNoTracking()
                    .Where(x => !x.IsDeleted && x.ProjectID == project.ID)
                    .ToListAsync();

            var masters = masterStages.Where(x => x.Typology == project.Typology).ToList();

            foreach (var stage in projectStages)
            {
                if (stage.StatusFlag == 1) continue;

                var exist = masterStages.FirstOrDefault(x => x.Title == stage.Title);
                if (exist != null)
                {
                    db.Entry(stage).State = EntityState.Deleted;
                }
                else
                {
                    stage.Percentage = exist.Percentage;
                    db.Entry(stage).State = EntityState.Modified;
                }
            }
            foreach (var item in masters)
            {
                if (!projectStages.Any(x => x.Title == item.Title))
                {
                    db.ProjectStages.Add(new ProjectStage
                    {
                        ProjectID = project.ID,
                        Title = item.Title,
                        Percentage = item.Percentage,
                        TypeFlag = item.TypeFlag
                    });
                }
            }

        }
        await db.SaveChangesAsync();


    }
    public async Task RegenerateCodes()
    {
        var projects = await Get()
            .OrderBy(x => x.Created)
            .ToListAsync();

        foreach (var project in projects)
        {
            var result = await GetNewCode(project.CompanyID.Value, project.ParentID, project.Created);

            project.OrderFlag = result.Order;
            project.Code = result.Code;
            await Update(project);
        }

    }

    public async Task<IEnumerable<ProjectStageAnalysisDto>> GetProjectStageAnalysis(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {
        var _projects = await Get(Filters, Search, Sort)
            .Include(x => x.ClientContact)
            .Include(x => x.Stages)
            .Include(x => x.Teams).ThenInclude(y => y.ContactTeam)
            .ToListAsync();

        _projects = _projects.Where(x => x.Stages != null && x.Stages.Count > 0).ToList();

        //if (Filters != null)
        //{
        //    if (Filters.Where(x => x.Key.Equals("targetDateStart", StringComparison.OrdinalIgnoreCase)).Any())
        //    {
        //        var _item = Filters.First(x => x.Key.Equals("targetDateStart", StringComparison.OrdinalIgnoreCase));

        //        DateTime result = Convert.ToDateTime(_item.Value);
        //        _projects = _projects.Select(x => x.Stages.Where(y => y.DueDate >= result));
        //    }

        //    if (Filters.Where(x => x.Key.Equals("targetDateEnd", StringComparison.OrdinalIgnoreCase)).Any())
        //    {
        //        var _item = Filters.First(x => x.Key.Equals("targetDateEnd", StringComparison.OrdinalIgnoreCase));

        //        DateTime result = Convert.ToDateTime(_item.Value);
        //        var end = result.AddDays(1);
        //        _query = _query.Where(x => x.Created < end);

        //    }
        //}



        var _projectMaster = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(Project))
          .ToListAsync();

        var _stageMaster = await db.StatusMasters.AsNoTracking()
          .Where(x => x.Entity == nameof(ProjectStage))
          .ToListAsync();

        var _stagesAnalysis = _projects.Where(x => x.ID != null)
            .Select(x =>
            {

                var _pendingPercentage = x.Stages.Any() ? x.Stages.Where(s => s.ParentID == null && s.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_PENDING).Sum(y => y.Percentage) : 0;
                var _completedPercentage = x.Stages.Any() ? x.Stages.Where(s => s.ParentID == null && s.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED).Sum(y => y.Percentage) : 0;
                var _billPercentage = x.Stages.Any() ? x.Stages.Where(s => s.ParentID == null && s.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_BILLED).Sum(y => y.Percentage) : 0;
                var _receivedPercentage = x.Stages.Any() ? x.Stages.Where(s => s.ParentID == null && s.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_PAYMENT_RECEIVED).Sum(y => y.Percentage) : 0;

                return new ProjectStageAnalysisDto
                {
                    ProjectID = x.ID,
                    Title = x.Title,
                    Code = x.Code,
                    StatusFlag = x.StatusFlag,
                    StatusValue = _projectMaster.Any(y => y.Value == x.StatusFlag) ? _projectMaster.FirstOrDefault(y => y.Value == x.StatusFlag).Title : "",
                    Typology = x.Typology,
                    ContractStartDate = x.ContractStartDate,
                    ContractCompletionDate = x.ContractCompletionDate,
                    Fee = x.Fee,
                    WorkPendingPercentage = _pendingPercentage,
                    WorkCompletedPercentage = _completedPercentage,
                    BilledPercentage = _billPercentage,
                    PaymentReceivedPercentage = _receivedPercentage,
                    WorkPendingAmount = _pendingPercentage > 0 ? (x.Fee * _pendingPercentage) / 100 : 0,
                    WorkCompletedAmount = _completedPercentage > 0 ? (x.Fee * _completedPercentage) / 100 : 0,
                    BilledAmount = _billPercentage > 0 ? (x.Fee * _billPercentage) / 100 : 0,
                    PaymentReceivedAmount = _receivedPercentage > 0 ? (x.Fee * _receivedPercentage) / 100 : 0,
                    ClientContact = x.ClientContact != null ? x.ClientContact.FullName : "",
                    Stages = x.Stages.Where(s => s.ParentID == null).Select(y => new StageAnalysisDto
                    {
                        ProjectID = y.ProjectID,
                        Title = y.Title,
                        Percentage = y.Percentage,
                        StatusFlag = y.StatusFlag,
                        StatusValue = _stageMaster.Any(x => x.Value == y.StatusFlag) ? _stageMaster.FirstOrDefault(x => x.Value == y.StatusFlag).Title : "",
                        TargetDate = y.DueDate,
                        BillingDate = y.BillingDate,
                        PaymentReceivedDate = y.PaymentReceivedDate
                    }).ToList(),
                    Teams = x.Teams.Any() ? x.Teams.Select(y => new StageAnalysisTeam
                    {
                        Title = y.ContactTeam.Title,
                        ID = y.ContactTeam.ID
                    }).ToList() : new List<StageAnalysisTeam>()
                };
            });

        return _stagesAnalysis;
    }

    public async Task GenerateWorkOrderStageandBillingData()
    {
        //var _workOrderService = new WorkOrderService(db);
        //var _workOrderStageService = new WorkOrderStageService(db);

        //var _projects = await Get()
        //                .Include(x => x.Stages)

        //                .Include(x => x.Bills)
        //                .ThenInclude(b => b.Stages)

        //                .Include(x => x.Bills)
        //                .ThenInclude(b => b.Payments)

        //                .ToListAsync();


        //var _project = _projects[0];
        //var _stages = _project.Stages;
        //var _bills = _project.Bills;

        ////New WorkOrder
        //var _workOrder = new WorkOrder();
        //_workOrder.ProjectID = _project.ID;
        //_workOrder.CompanyID = _project.CompanyID.Value;
        //_workOrder.Typology = _project.Typology;
        //_workOrder.Amount = (int)_project.Fee;
        //db.WorkOrders.Add(_workOrder);
        //await db.SaveChangesAsync();


        ////New WorkOrder Stages
        //if (_stages != null)
        //{
        //    foreach (var stage in _stages)
        //    {
        //        var _stage = new WorkOrderStage();
        //        _stage.Abbreviation = stage.Abbreviation;
        //        _stage.Amount = stage.Amount;
        //        _stage.BillingDate = stage.BillingDate;
        //        _stage.Description = stage.Description;
        //        _stage.DueDate = stage.DueDate;
        //        _stage.IsReadOnly = stage.IsReadOnly;
        //        _stage.OrderFlag = stage.OrderFlag;
        //        _stage.ParentID = stage.ParentID;
        //        _stage.PaymentReceivedDate = stage.PaymentReceivedDate;
        //        _stage.Percentage = stage.Percentage;
        //        _stage.ProjectID = stage.ProjectID;
        //        _stage.StatusFlag = stage.StatusFlag;
        //        _stage.Title = stage.Title;
        //        _stage.TypeFlag = stage.TypeFlag;
        //        _stage.WorkOrderID = _workOrder.ID;
        //        _stage.IsLumpsum = stage.IsLumpsum;
        //        db.WorkOrderStages.AddRange(_stage);
        //        await db.SaveChangesAsync();
        //    }
        //}

        ////Bills
        //if (_bills != null)
        //{
        //    foreach (var bill in _bills)
        //    {
        //        var _bill = new ProjectBill();
        //        _bill.IsPreDated = bill.IsPreDated;
        //        _bill.WorkOrderID = _workOrder.ID;
        //        _bill.ProjectID = bill.ProjectID;
        //        _bill.WorkOrderNo = bill.WorkOrderNo;
        //        _bill.ProformaInvoiceNo = bill.ProformaInvoiceNo;
        //        _bill.TaxInvoiceNo = bill.TaxInvoiceNo;
        //        _bill.IsLumpSump = bill.IsLumpSump;
        //        _bill.ProjectFee = bill.ProjectFee;
        //        _bill.BillPercentage = bill.BillPercentage;
        //        _bill.WorkPercentage = bill.WorkPercentage;
        //        _bill.ProformaDate = bill.ProformaDate;
        //        _bill.BillDate = bill.BillDate;
        //        _bill.BillAmount = bill.BillAmount;
        //        _bill.PreviousBillAmount = bill.PreviousBillAmount;
        //        _bill.DueAmount = bill.DueAmount;
        //        _bill.IGSTShare = bill.IGSTShare;
        //        _bill.IGSTAmount = bill.IGSTAmount;
        //        _bill.CGSTShare = bill.CGSTShare;
        //        _bill.CGSTAmount = bill.CGSTAmount;
        //        _bill.SGSTShare = bill.SGSTShare;
        //        _bill.SGSTAmount = bill.SGSTAmount;
        //        _bill.PayableAmount = bill.PayableAmount;
        //        _bill.TDSAmount = bill.TDSAmount;
        //        _bill.AmountAfterTDS = bill.AmountAfterTDS;
        //        _bill.ReverseTaxCharges = bill.ReverseTaxCharges;
        //        _bill.AmountInWords = bill.AmountInWords;
        //        _bill.ReverseTaxCharges = bill.ReverseTaxCharges;
        //        _bill.AmountInWords = bill.AmountInWords;
        //        _bill.HSN = bill.HSN;
        //        _bill.ClientContactID = bill.ClientContactID;
        //        _bill.ClientName = bill.ClientName;
        //        _bill.ClientAddress = bill.ClientAddress;
        //        _bill.ClientGSTIN = bill.ClientGSTIN;
        //        _bill.ClientPAN = bill.ClientPAN;
        //        _bill.ClientTAN = bill.ClientTAN;
        //        _bill.ClientGSTStateCode = bill.ClientGSTStateCode;
        //        _bill.CompanyID = bill.CompanyID;
        //        _bill.CompanyName = bill.CompanyName;
        //        _bill.CompanyAddress = bill.CompanyAddress;
        //        _bill.CompanyGSTIN = bill.CompanyGSTIN;
        //        _bill.CompanyPAN = bill.CompanyPAN;
        //        _bill.CompanyTAN = bill.CompanyTAN;
        //        _bill.CompanyUDHYAM = bill.CompanyUDHYAM;
        //        _bill.CompanyGSTStateCode = bill.CompanyGSTStateCode;
        //        _bill.CompanyLogoUrl = bill.CompanyLogoUrl;
        //        _bill.CompanyBank = bill.CompanyBank;
        //        _bill.CompanyBankBranch = bill.CompanyBankBranch;
        //        _bill.CompanyBankIFSCCode = bill.CompanyBankIFSCCode;
        //        _bill.CompanySwiftCode = bill.CompanySwiftCode;
        //        _bill.CompanyBankAccount = bill.CompanyBankAccount;
        //        _bill.CompanySignStampUrl = bill.CompanySignStampUrl;
        //        _bill.ProformaInvoiceUrl = bill.ProformaInvoiceUrl;
        //        _bill.TaxInvoiceUrl = bill.TaxInvoiceUrl;
        //        db.ProjectBills.AddRange(_bill);
        //        await db.SaveChangesAsync();
        //    }
        //}
    }

    public class ProjectCode
    {
        public int Order { get; set; }
        public string? Code { get; set; }
    }

    public class ProjectAnalysis
    {
        public int ID { get; set; }
        public Guid UID { get; set; }
        public string? Company { get; set; }
        public string? Title { get; set; }
        public string? Code { get; set; }
        public string? Location { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }

        public int StatusFlag { get; set; }
        public string? Status { get; set; }
        public string? Segment { get; set; }
        //public string? Partner { get; set; }
        public string? Client { get; set; }
        public string? ReferredBy { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
        public DateTime? ExpectedCompletionDate { get; set; }
        [Precision(18, 2)] public decimal Fee { get; set; }
        [Precision(18, 2)] public decimal ExpectedMHr { get; set; }
        [Precision(18, 2)] public decimal AssignedMHr { get; set; }
        [Precision(18, 2)] public decimal ConsumedMHr { get; set; }
        [Precision(18, 2)] public decimal AssessedMHr { get; set; }
        [Precision(18, 2)]
        public decimal BurnedMHr
        {
            get { return ConsumedMHr > AssessedMHr ? ConsumedMHr - AssessedMHr : 0.0m; }
        }
        [Precision(18, 2)]
        public decimal AvailableMHr
        {
            get { return ExpectedMHr > AssessedMHr ? ExpectedMHr - AssessedMHr : 0.0m; }
        }
        [Precision(18, 2)] public decimal AverageAssessmentPoints { get; set; }
        [Precision(18, 2)] public decimal LandscapeArea { get; set; }
        [Precision(18, 2)] public decimal FacadeArea { get; set; }
        [Precision(18, 2)] public decimal InteriorArea { get; set; }

    }
}