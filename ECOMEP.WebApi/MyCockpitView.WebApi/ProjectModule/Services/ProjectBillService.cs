
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.Utility.RDLCClient;
using MyCockpitView.WebApi.AzureBlobsModule;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Exceptions;
using MyCockpitView.WebApi.Services;
using MyCockpitView.WebApi.StatusMasterModule;
using MyCockpitView.WebApi.CompanyModule;

namespace MyCockpitView.WebApi.ProjectModule.Services;

public interface IProjectBillService : IBaseEntityService<ProjectBill>
{
   
    Task<ProjectBill> GetDraft(Project project, int TypeFlag,bool IsPreDated=false);
    Task<int> Create(ProjectBill entity, Project project);
    Task Update(ProjectBill entity, Project project);
    Task<ReportDefinition> GeneratePdf(ProjectBill _bill, bool showLetterHead = false);
}

public class ProjectBillService : BaseEntityService<ProjectBill>, IProjectBillService
{
    private readonly IAzureBlobService azureBlobService;

    public ProjectBillService(EntitiesContext db,IAzureBlobService azureBlobService) : base(db)
    {
        this.azureBlobService = azureBlobService;
    }

    public IQueryable<ProjectBill> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null)
    {

        IQueryable<ProjectBill> _query = base.Get(Filters);
        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectBill>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("projectid", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = int.TryParse(_item.Value, out int n);
                    if (isNumeric)
                        predicate = predicate.Or(x => x.ProjectID == n);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("WorkOrderID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectBill>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("WorkOrderID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.WorkOrderID == isNumeric);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("CompanyID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectBill>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("CompanyID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = int.TryParse(_item.Value, out int n);
                    if (isNumeric)
                        predicate = predicate.Or(x => x.CompanyID == n);
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("ClientContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectBill>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ClientContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = int.TryParse(_item.Value, out int n);
                    if (isNumeric)
                        predicate = predicate.Or(x => x.ClientContactID == n);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("BillDate", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.Where(x => x.Key.Equals("BillDate", StringComparison.OrdinalIgnoreCase)).First();

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime n);
                if (isDateTime)
                    _query = _query.Where(x => x.BillDate.Date == n.Date);
            }

            if (Filters.Where(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangestart", StringComparison.OrdinalIgnoreCase));

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime result);
                if (isDateTime)
                    _query = _query.Where(x => x.BillDate >= result);
            }

            if (Filters.Where(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("rangeend", StringComparison.OrdinalIgnoreCase));

                var isDateTime = DateTime.TryParse(_item.Value, out DateTime result);

                if (isDateTime)
                {
                    var end = result.AddDays(1);
                    _query = _query.Where(x => x.BillDate < end);
                }
            }

            if (Filters.Where(x => x.Key.Equals("ProjectStatusFlag", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectBill>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectStatusFlag", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Project.StatusFlag == isNumeric);
                }
                _query = _query.Include(x=>x.Project).Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectBill>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("TeamID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.Project.Teams.Any(t => t.ContactTeamID == isNumeric));
                }
                _query = _query.Include(x => x.Project).ThenInclude(x=>x.Teams).Where(predicate);
            }
        }

        if (Search != null && Search != String.Empty)
        {
            var _keyword=Search.Trim();
            
                _query = _query.Where(x => x.ProformaInvoiceNo.ToLower().Contains(_keyword.ToLower())
                    || x.TaxInvoiceNo.ToLower().Contains(_keyword.ToLower())
                    || x.ProjectCode.ToLower().Contains(_keyword.ToLower())
                       || x.ProjectTitle.ToLower().Contains(_keyword.ToLower())
                       || x.ClientName.ToLower().Contains(_keyword.ToLower())
                         || x.CompanyName.ToLower().Contains(_keyword.ToLower())
                );
            
        }

        if (Sort != null && Sort != String.Empty)
        {
            switch (Sort.ToLower())
            {
                case "createddate":
                    return _query
                            .OrderBy(x => x.Created);

                case "modifieddate":
                    return _query
                            .OrderBy(x => x.Modified);

                case "createddate desc":
                    return _query
                            .OrderByDescending(x => x.Created);

                case "modifieddate desc":
                    return _query
                            .OrderByDescending(x => x.Modified);

                case "billdate":
                    return _query
                            .OrderBy(x => x.BillDate);

                case "billdate desc":
                    return _query
                            .OrderByDescending(x => x.BillDate);

            }
        }

        return _query
          .OrderBy(x => x.BillDate);

    }

    public async Task<ProjectBill> GetDraft(Project project,int TypeFlag,bool IsPostDated=false)
    {
      
        if (project.ClientContactID == null) throw new EntityServiceException("Client Contact is missing in Project billing details. Please update the details and try again!");

        //if (project.ClientContact.GSTIN == null || project.ClientContact.TAN==null || project.ClientContact.PAN==null) throw new EntityServiceException("Client Contact details like GST, PAN, TAN and other information is required for Invoice generation. Please update the details in Contact List and try again!");

        var entity = new ProjectBill()
        {
            ProformaDate = DateTime.Now,
            BillDate = DateTime.UtcNow,
            ProjectID = project.ID,
            TypeFlag=TypeFlag,
            IsPreDated=IsPostDated
        };
        entity.ProjectLocation = project.Location;
        entity.ProjectCode = project.Code;
        entity.ProjectTitle = project.Title;
        entity.ProjectFee = project.Fee;
        entity.HSN = project.HSN;

        entity.CompanyID = project.CompanyID;
        entity.CompanyName = project.Company?.Title;
        entity.CompanyAddress = project.Company?.Address;
        entity.CompanyTAN = project.Company?.TAN;
        entity.CompanyPAN = project.Company?.PAN;
        entity.CompanyUDHYAM = project.Company?.UDHYAM;
        entity.CompanyGSTIN = project.Company?.GSTIN;
        entity.CompanyGSTStateCode = project.Company?.GSTStateCode;
        entity.CompanyBank=project.Company?.Bank;
        entity.CompanyBankAccount = project.Company?.BankAccount;
        entity.CompanyBankBranch = project.Company?.BankBranch;
        entity.CompanyBankIFSCCode = project.Company?.BankIFSCCode;
        entity.CompanyLogoUrl = project.Company?.LogoUrl;
        entity.CompanySignStampUrl = project.Company?.SignStampUrl;

        entity.ClientContactID = project.ClientContactID;
        entity.ClientName = project.ClientContact?.FullName;
        if (project.ClientContact.Addresses.Any())
        {
            var primaryAddress = project.ClientContact.Addresses.FirstOrDefault(x => x.IsPrimary);

            if (primaryAddress != null)
            {
                var addressLines = new List<string> {
                            primaryAddress.Street,
                            primaryAddress.Area,
                            primaryAddress.City,
                            primaryAddress.State,
                    $"{primaryAddress.Country} - {primaryAddress.PinCode}"
                };

                // Filter out null or empty values
                entity.ClientAddress = string.Join(",\n", addressLines.Where(value => !string.IsNullOrEmpty(value)));
            }

        }
        entity.ClientGSTIN = project.ClientContact.GSTIN;
        entity.ClientGSTStateCode = project.StateCode ?? "27";
        entity.ClientPAN = project.ClientContact.PAN;
        entity.ClientTAN = project.ClientContact.TAN;

        if (!entity.IsPreDated)
        {
            if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE && (entity.ProformaInvoiceNo == null || entity.ProformaInvoiceNo == String.Empty))
            {
                entity.OrderFlag = await GetNextFinancialYearIndex(project.Company,entity.BillDate, entity.TypeFlag, 3);
                entity.ProformaInvoiceNo = $"{project.Company.Initials}/PI/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.BillDate))}/{entity.OrderFlag.ToString("000")}";
                //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
            }

            if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_TAX_INVOICE && (entity.TaxInvoiceNo == null || entity.TaxInvoiceNo == String.Empty))
            {
                entity.OrderFlag = await GetNextFinancialYearIndex(project.Company,entity.BillDate, entity.TypeFlag, 3);
                entity.TaxInvoiceNo = $"{project.Company.Initials}/TI/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.BillDate))}/{entity.OrderFlag.ToString("000")}";
                //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
            }
        }

        //if (_project.WorkOrders.Where(x => !x.IsDeleted).Any())
        //{
        //    var _latestWorkOrder = _project.WorkOrders.Where(x => !x.IsDeleted).OrderByDescending(x => x.WorkOrderDate).FirstOrDefault();
        //    if (_latestWorkOrder.TypeFlag == McvConstant.PROJECT_WORK_ORDER_TYPEFLAG_LUMPSUM)
        //    {
        //        entity.IsLumpSump = true;
        //    }

        //    entity.TotalAreaFees = _latestWorkOrder.Fees;
        //    entity.TotalAreaOfConstructon = Convert.ToDecimal(_latestWorkOrder.Area);
        //}

        entity.AmountInWords = Convert.ToDecimal(entity.PayableAmount).ToWords();

        //entity.WorkPercentage = project.Stages.Where(x => !x.IsDeleted).Where(x => x.TypeFlag == McvConstant.PROJECT_STAGE_TYPEFLAG_WORK && x.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED).Any() ?
        //    project.Stages.Where(x => x.TypeFlag == McvConstant.PROJECT_STAGE_TYPEFLAG_WORK && x.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED).Sum(x => x.Percentage) :
        //    0;

        ////Entity.WorkPercentage = 0;
        //foreach (var _stage in project.Stages.Where(x => !x.IsDeleted).Where(x => !x.IsDeleted)
        //    .Where(x => x.TypeFlag == McvConstant.PROJECT_STAGE_TYPEFLAG_WORK && x.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED && x.Percentage != 0 && x.ParentID != null))
        //{
        //    var paymentStage = project.Stages.Where(x => !x.IsDeleted).SingleOrDefault(x => x.ID == _stage.ParentID);
        //    if (paymentStage != null)
        //    {
        //        if (!entity.Stages.Any(x => x.Title == paymentStage.Title))
        //        {
        //            entity.Stages.Add(new BillStage
        //            {
        //                OrderFlag = paymentStage.OrderFlag,
        //                Title = paymentStage.Title,
        //                Percentage = paymentStage.Percentage
        //            });
        //            //Entity.WorkPercentage = Entity.WorkPercentage + _stage.WorkOrderPercentage;
        //        }
        //    }
        //}

        return entity;
    }
    public async Task<int> Create(ProjectBill entity,Project project)
    {

       
            if (project.ClientContactID == null) throw new EntityServiceException("Client Contact is missing in Project billing details. Please update the details and try again!");

            entity.ProformaDate = entity.BillDate;

            entity.ProjectLocation = project.Location;
            entity.ProjectCode = project.Code;
            entity.ProjectTitle = project.Title;
            entity.ProjectFee = project.Fee;
            entity.HSN = project.HSN;

            entity.CompanyID = project.CompanyID;
            entity.CompanyName = project.Company?.Title;
            entity.CompanyAddress = project.Company?.Address;
            entity.CompanyTAN = project.Company?.TAN;
            entity.CompanyPAN = project.Company?.PAN;
            entity.CompanyUDHYAM = project.Company?.UDHYAM;
            entity.CompanyGSTIN = project.Company?.GSTIN;
            entity.CompanyGSTStateCode = project.Company?.GSTStateCode;
            entity.CompanyBank = project.Company?.Bank;
            entity.CompanyBankAccount = project.Company?.BankAccount;
            entity.CompanyBankBranch = project.Company?.BankBranch;
            entity.CompanyBankIFSCCode = project.Company?.BankIFSCCode;
            entity.CompanyLogoUrl = project.Company?.LogoUrl;
            entity.CompanySignStampUrl = project.Company?.SignStampUrl;

            entity.ClientContactID = project.ClientContactID;
            entity.ClientName = project.ClientContact?.FullName;
            if (project.ClientContact.Addresses.Any())
            {
                var primaryAddress = project.ClientContact.Addresses.FirstOrDefault(x => x.IsPrimary);

                if (primaryAddress != null)
                {
                    var addressLines = new List<string> {
                            primaryAddress.Street,
                            primaryAddress.Area,
                            primaryAddress.City,
                            primaryAddress.State,
                    $"{primaryAddress.Country} - {primaryAddress.PinCode}"
                };

                    // Filter out null or empty values
                    entity.ClientAddress = string.Join(",\n", addressLines.Where(value => !string.IsNullOrEmpty(value)));
                }

            }
            entity.ClientGSTIN = project.ClientContact.GSTIN;
            entity.ClientGSTStateCode = project.StateCode ?? "27";
            entity.ClientPAN = project.ClientContact.PAN;
            entity.ClientTAN = project.ClientContact.TAN;

        if (!entity.IsPreDated) {
            if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE && (entity.ProformaInvoiceNo == null || entity.ProformaInvoiceNo == String.Empty))
            {
                entity.OrderFlag = await GetNextFinancialYearIndex(project.Company, entity.BillDate, entity.TypeFlag, 3);
                entity.ProformaInvoiceNo = $"{project.Company.Initials}/PI/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.BillDate))}/{entity.OrderFlag.ToString("000")}";
                //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
            }

            if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_TAX_INVOICE && (entity.TaxInvoiceNo == null || entity.TaxInvoiceNo == String.Empty))
            {
                entity.OrderFlag = await GetNextFinancialYearIndex(project.Company, entity.BillDate, entity.TypeFlag, 3);
                entity.TaxInvoiceNo = $"{project.Company.Initials}/TI/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.BillDate))}/{entity.OrderFlag.ToString("000")}";
                //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
            }
        }

            entity.AmountInWords = Convert.ToDecimal(entity.PayableAmount).ToWords();



            var _sharedService = new SharedService(db);

            var azureStorageKey = await _sharedService.GetPresetValue(McvConstant.AZURE_STORAGE_KEY);
            var container = await _sharedService.GetPresetValue(McvConstant.BLOB_CONTAINER_ATTACHMENTS);
            var devmode = Convert.ToBoolean(await _sharedService.GetPresetValue(McvConstant.DEVMODE));

            var reportDefinition = await GeneratePdf(entity, true);
            if (reportDefinition != null)
            {
                entity.ProformaInvoiceUrl = await azureBlobService.UploadAsync(azureStorageKey, container, $"Project/{project.Code}/Invoices/{Guid.NewGuid()}/{(devmode ? "DEV/" : "")}{reportDefinition.Filename}{reportDefinition.FileExtension}", new MemoryStream(reportDefinition.FileContent));

            }
            //var reportDefinition2 = await GeneratePdf(entity);
            //if (reportDefinition2 != null)
            //{
            //    entity.BlobUrlWithoutLetterHead = await azureBlobService.UploadAsync(azureStorageKey, container, "Project" + "/" + _project.Code + "/" + _project.Title + "/" + "ProjectBill" + "/NonLetterhead/" + reportDefinition2.Filename, new MemoryStream(reportDefinition2.FileContent));


            //}

        
        return await base.Create(entity);


    }


    private async Task<int> GetNextFinancialYearIndex(Company Company,DateTime BillDateUTC,int TypeFlag,int billFragmentYearIndex=2, int? BillID = null)
    {

        var billDateIST = ClockTools.GetIST(BillDateUTC);
        var _startDateIST = new DateTime(billDateIST.Month < 4 ? billDateIST.AddYears(-1).Year : billDateIST.Year, 4, 1);
        var _endDateIST = _startDateIST.AddYears(1);

        var _startUTC = ClockTools.GetUTC(_startDateIST);
        var _endUTC = ClockTools.GetUTC(_endDateIST);

        var _query = Get().Where(x=>!x.IsPreDated).Where(x => x.CompanyID == Company.ID);

        if(TypeFlag==McvConstant.PROJECT_BILL_TYPEFLAG_TAX_INVOICE)
            _query=_query.Where(x => x.BillDate >= _startUTC && x.BillDate < _endUTC);
        else
            _query = _query.Where(x => x.ProformaDate >= _startUTC && x.ProformaDate < _endUTC);

        if (BillID != null)
            _query = _query.Where(x => x.ID != BillID.Value);


        string? billNo = null;

        if (TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_TAX_INVOICE)
        {
            billNo = await _query
            .OrderByDescending(x => x.TaxInvoiceNo)
            .Select(x => x.TaxInvoiceNo)
            .FirstOrDefaultAsync();
        }
        else
        {
            billNo = await _query
            .OrderByDescending(x => x.ProformaInvoiceNo)
            .Select(x => x.ProformaInvoiceNo)
            .FirstOrDefaultAsync();
        }

        var _index = 1;
        if (_endUTC < new DateTime(2025, 4, 1))
        {
            if (Company.Initials.ToUpper() == "EMC")
            {
                if (TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE)
                {

                    _index = 265;
                }
                else
                {

                    _index = 218;
                }
            }else if (Company.Initials.ToUpper() == "EMCPL")
            {
                if (TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE)
                {

                    _index = 15;
                }
                else
                {

                    _index = 6;
                }
            }
            else //PCE
            {
                if (TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE)
                {

                    _index = 12;
                }
                else
                {

                    _index = 9;
                }
            }
        }
        if (!string.IsNullOrEmpty(billNo))
        {
            _index = int.TryParse((billNo.Split('/')[billFragmentYearIndex]), out int n) ? n + 1 : _index;
        }

        return _index;

    }

    private async Task<string> GetProjectSequenceCode(int ProjectID,int TypeFlag, int? BillID = null)
    {

        
            var _project = await db.Projects.AsNoTracking()
                .SingleOrDefaultAsync(x => x.ID == ProjectID);
            if (_project == null) return null;

            var _query = Get().Where(x => x.TypeFlag == TypeFlag
              && x.ProjectID == _project.ID);

            if (BillID != null)
                _query = _query.Where(x => x.ID != BillID.Value);

            var _billCount = await _query.CountAsync();

            var _index = _billCount + 1;

            return _project.Code + "-" + _index.ToString("00");
        

    }

    public async Task Update(ProjectBill entity, Project project)
    {
       
        if (project.ClientContactID == null) throw new EntityServiceException("Client Contact is missing in Project billing details. Please update the details and try again!");

        if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE)
        {
            entity.ProformaDate = entity.BillDate;
        }

        entity.ProjectLocation = project.Location;
        entity.ProjectCode = project.Code;
        entity.ProjectTitle = project.Title;
        entity.ProjectFee = project.Fee;
        entity.HSN = project.HSN;

        entity.CompanyID = project.CompanyID;
        entity.CompanyName = project.Company?.Title;
        entity.CompanyAddress = project.Company?.Address;
        entity.CompanyTAN = project.Company?.TAN;
        entity.CompanyPAN = project.Company?.PAN;
        entity.CompanyUDHYAM = project.Company?.UDHYAM;
        entity.CompanyGSTIN = project.Company?.GSTIN;
        entity.CompanyGSTStateCode = project.Company?.GSTStateCode;
        entity.CompanyBank = project.Company?.Bank;
        entity.CompanyBankAccount = project.Company?.BankAccount;
        entity.CompanyBankBranch = project.Company?.BankBranch;
        entity.CompanyBankIFSCCode = project.Company?.BankIFSCCode;
        entity.CompanyLogoUrl = project.Company?.LogoUrl;
        entity.CompanySignStampUrl = project.Company?.SignStampUrl;

        entity.ClientContactID = project.ClientContactID;
        entity.ClientName = project.ClientContact?.FullName;
        if (project.ClientContact.Addresses.Any())
        {
            var primaryAddress = project.ClientContact.Addresses.FirstOrDefault(x => x.IsPrimary);

            if (primaryAddress != null)
            {
                var addressLines = new List<string> {
                            primaryAddress.Street,
                            primaryAddress.Area,
                            primaryAddress.City,
                            primaryAddress.State,
                    $"{primaryAddress.Country} - {primaryAddress.PinCode}"
                };

                // Filter out null or empty values
                entity.ClientAddress = string.Join(",\n", addressLines.Where(value => !string.IsNullOrEmpty(value)));
            }

        }
        entity.ClientGSTIN = project.ClientContact.GSTIN;
        entity.ClientGSTStateCode = project.StateCode ?? "27";
        entity.ClientPAN = project.ClientContact.PAN;
        entity.ClientTAN = project.ClientContact.TAN;

        if (!entity.IsPreDated)
        {
            if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE && (entity.ProformaInvoiceNo == null || entity.ProformaInvoiceNo == String.Empty))
            {
                entity.OrderFlag = await GetNextFinancialYearIndex(project.Company, entity.BillDate, entity.TypeFlag, 3);
                entity.ProformaInvoiceNo = $"{project.Company.Initials}/PI/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.BillDate))}/{entity.OrderFlag.ToString("000")}";
                //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
            }

            if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_TAX_INVOICE && (entity.TaxInvoiceNo == null || entity.TaxInvoiceNo == String.Empty))
            {
                entity.OrderFlag = await GetNextFinancialYearIndex(project.Company, entity.BillDate, entity.TypeFlag, 3);
                entity.TaxInvoiceNo = $"{project.Company.Initials}/TI/{ClockTools.GetFinancialYearMid(ClockTools.GetIST(entity.BillDate))}/{entity.OrderFlag.ToString("000")}";
                //entity.SequenceNo = await GetProjectSequenceCode(entity.ProjectID, entity.TypeFlag);
            }
        }
        entity.AmountInWords = Convert.ToDecimal(entity.PayableAmount).ToWords();

       

        //entity.WorkPercentage = project.Stages.Where(x => !x.IsDeleted).Where(x => x.TypeFlag == McvConstant.PROJECT_STAGE_TYPEFLAG_WORK && x.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED).Any() ?
        //  project.Stages.Where(x => !x.IsDeleted).Where(x => x.TypeFlag == McvConstant.PROJECT_STAGE_TYPEFLAG_WORK && x.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED).Sum(x => x.Percentage) :
        //  0;

        //var paymentRelatedStages = project.Stages.Where(x => !x.IsDeleted)
        //    .Where(x => x.TypeFlag == McvConstant.PROJECT_STAGE_TYPEFLAG_WORK && x.StatusFlag == McvConstant.PROJECT_STAGE_STATUSFLAG_COMPLETED && x.Percentage != 0 && x.ParentID != null);
      
        //var newStages = new List<BillStage>();
        //foreach (var _stage in paymentRelatedStages)
        //{
        //    var paymentStage = project.Stages.Where(x => !x.IsDeleted)
        //        .Where(x => x.TypeFlag == McvConstant.PROJECT_STAGE_TYPEFLAG_PAYMENT)
        //        .SingleOrDefault(x => x.ID == _stage.ParentID);
        //    if (paymentStage != null)
        //    {
        //        if (!newStages.Any(x => x.Title == paymentStage.Title))
        //        {
        //            newStages.Add(new BillStage
        //            {
                        
        //                OrderFlag = paymentStage.OrderFlag,
        //                Title = paymentStage.Title,
        //                Percentage = paymentStage.Percentage
        //            });
        //        }
        //    }
        //}

        //entity.Stages= newStages;

      
        var _sharedService = new SharedService(db);
        var devmode = Convert.ToBoolean(await _sharedService.GetPresetValue(McvConstant.DEVMODE));
        
            var azureStorageKey = await _sharedService.GetPresetValue(McvConstant.AZURE_STORAGE_KEY);
            var container = await _sharedService.GetPresetValue(McvConstant.BLOB_CONTAINER_ATTACHMENTS);
     
            var reportDefinition = await GeneratePdf(entity, true);
        if (reportDefinition != null)
        {
            if (entity.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_PROFORMA_INVOICE)
            {
                entity.ProformaInvoiceUrl = await azureBlobService.UploadAsync(azureStorageKey, container, $"Project/{project.Code}/Invoices/{Guid.NewGuid()}/{(devmode ? "DEV/" : "")}{reportDefinition.Filename}{reportDefinition.FileExtension}", new MemoryStream(reportDefinition.FileContent));
            }
            else
            {
                entity.TaxInvoiceUrl = await azureBlobService.UploadAsync(azureStorageKey, container, $"Project/{project.Code}/Invoices/{Guid.NewGuid()}/{(devmode ? "DEV/" : "")}{reportDefinition.Filename}{reportDefinition.FileExtension}", new MemoryStream(reportDefinition.FileContent));
            }

        }


        await base.Update(entity);



    }

    public async Task<ReportDefinition> GeneratePdf(ProjectBill _bill, bool showLetterHead = false)
    {


        var _project = await db.Projects.AsNoTracking().Where(x => !x.IsDeleted)
            .Include(x=>x.Stages)
            //.Include(x => x.WorkOrders.Select(s => s.Areas))
            .Include(x => x.Company)
            //.Include(x => x.Associations.Select(c => c.Contact))
                    .SingleOrDefaultAsync(x => x.ID == _bill.ProjectID);

        if (_project == null)
             throw new EntityServiceException("Project not found!");

        if (string.IsNullOrEmpty(_project.Country))
            throw new EntityServiceException("Country value is missing in project!");


        //var lastWorkOrder = _project.WorkOrders.Where(x => !x.IsDeleted).LastOrDefault();

        var _sharedService = new SharedService(db);


        //string _hsnCode = null;
        //    if (_project.Segment == "Residential")
        //    {
        //        var _global = await db.AppSettingMasters.AsNoTracking().SingleOrDefaultAsync(x => x.PropertyKey == "HSNResidentialCode");
        //        _hsnCode = _global.PropertyValue;
        //    }
        //    else if (_project.Segment == "Non-Residential")
        //    {
        //        var _global = await db.AppSettingMasters.AsNoTracking().SingleOrDefaultAsync(x => x.PropertyKey == "HSNNonResidentialCode");
        //        _hsnCode = _global.PropertyValue;
        //    }

        var _workOrder = await db.WorkOrders.AsNoTracking()
                         .Where(x => x.ID == _bill.WorkOrderID)
                         .Include(x => x.Stages)
                         .SingleOrDefaultAsync();

        var dateFormat = await _sharedService.GetPresetValue(McvConstant.DATE_FORMAT);

        var data = new List<BillReportData> {
                    new BillReportData {
                          BillNo = _bill.TaxInvoiceNo ?? _bill.ProformaInvoiceNo,
                        //SequenceNo = _bill.SequenceNo,
                        WorkPercentage = Math.Round(_bill.WorkPercentage, 2),
                        BillPercentage = Math.Round(_bill.BillPercentage, 2),
                        BillDate = ClockTools.GetIST(_bill.BillDate).ToString(dateFormat),
                        BillAmount = _bill.BillAmount,
                        PreviousBillAmount = _bill.PreviousBillAmount,
                        DueAmount = _bill.DueAmount,
                      IsIGSTApplicable=_bill.IsIGSTApplicable,
                        CGSTShare = _bill.CGSTShare,
                        CGSTAmount = _bill.CGSTAmount,
                        IGSTShare = _bill.IGSTShare,
                        IGSTAmount = _bill.IGSTAmount,
                        SGSTShare = _bill.SGSTShare,
                        SGSTAmount = _bill.SGSTAmount,
                        PayableAmount = _bill.PayableAmount,
                        AmountInWords = _bill.AmountInWords,
                       HSN=_bill.HSN,
                        ReverseTaxCharges = _bill.ReverseTaxCharges,
                         TypeFlag = _bill.TypeFlag,
                           ProjectCode= _bill.ProjectCode,
                        ProjectTitle= _bill.ProjectTitle,
                         //ProjectFee=_bill.ProjectFee,
                         ProjectFee=_workOrder.Amount,
                         ProjectLocation= _bill.ProjectLocation,
                        ClientName = _bill.ClientName,
                        ClientAddress =_bill.ClientAddress,
                        ClientGSTStateCode = _bill.ClientGSTStateCode,
                        ClientPAN=_bill.ClientPAN,
                        ClientTAN=_bill.ClientTAN,
                        ClientGSTIN=_bill.ClientGSTIN,
                        CompanyName= _bill.CompanyName,
                        CompanyAddress= _bill.CompanyAddress,
                        CompanyGSTIN= _bill.CompanyGSTIN,
                        CompanyGSTStateCode= _bill.CompanyGSTStateCode,
                        CompanyPAN= _bill.CompanyPAN,
                        CompanyUDHYAM=_bill.CompanyUDHYAM,
                        CompanyTAN= _bill.CompanyTAN,
                        CompanyBank= _bill.CompanyBank,
                        CompanyBankAccount= _bill.CompanyBankAccount,
                        CompanyBankBranch= _bill.CompanyBankBranch,
                        CompanyBankIFSCCode= _bill.CompanyBankIFSCCode,
                        CompanyLogoUrl= _bill.CompanyLogoUrl,
                        CompanySignStampUrl= _bill.CompanySignStampUrl,
                        CompanySwiftCode= _bill.CompanySwiftCode,
                        WorkOrderNo=_bill.WorkOrderNo,
                        WorkOrderDate=_bill.WorkOrderDate!=null ? ClockTools.GetIST(_bill.WorkOrderDate.Value).ToString(dateFormat) : null,
                    }  
                };

        var _billsData = await Get()
            .Include(x=>x.Payments)
            .Where(x=>x.ProjectID==_project.ID)
            .Where(x=>x.ID!=_bill.ID)
          //.Select(x => new {
          //           BillNo = _bill.TaxInvoiceNo,
          //      _bill.BillPercentage,
          //      _bill.BillDate,
          //      _bill.BillAmount,
          //      _bill.DueAmount,
          //      _bill.PayableAmount
          //})
         .OrderBy(x=>x.BillDate)
         .ToListAsync();

        _billsData.Add(_bill);



        var previousBills = _billsData
          .Select(x => new BillReportData
          {
              StageTitle = x.Stages.Any() ? x.Stages.FirstOrDefault().Title : null,
              BillNo = x.TaxInvoiceNo ?? x.ProformaInvoiceNo,
              BillPercentage = x.BillPercentage,
              BillDate = x.BillDate.ToISTFormat().ToString(dateFormat),
              BillAmount = x.BillAmount,
              DueAmount = x.DueAmount,
              CGSTAmount = x.CGSTAmount + x.IGSTAmount + x.SGSTAmount,
              PayableAmount = x.PayableAmount,
              PaymentDate = x.Payments.Any() ? x.Payments.FirstOrDefault().TransactionDate.Value.ToISTFormat().ToString(dateFormat) : null,
              PaymentDetail = x.Payments.Any() ? x.Payments.FirstOrDefault().Mode + " (" + x.Payments.FirstOrDefault().TransactionNo + ")" : null
          }).Where(x => x.StageTitle != null);


        var statusMasterService = new StatusMasterService(db);
        var statusMasters = await statusMasterService.Get().Where(x => x.Entity == nameof(ProjectStage)).Select(x => new
        {
            x.Value,
            x.Title
        }).ToListAsync();

        var IGSTRate = Convert.ToDecimal(await _sharedService.GetPresetValue(McvConstant.TAX_IGST));
        var SGSTRate = Convert.ToDecimal(await _sharedService.GetPresetValue(McvConstant.TAX_SGST));
        var CGSTRate = Convert.ToDecimal(await _sharedService.GetPresetValue(McvConstant.TAX_CGST));

        var GSTRate = _project.Country.ToUpper() == "INDIA" ?(_bill.ClientGSTStateCode != _bill.CompanyGSTStateCode ? IGSTRate : CGSTRate + SGSTRate):0;

        var projectStageData = _workOrder.Stages
            .OrderBy(x=>x.OrderFlag)
            .Where(x => !x.IsReadOnly)
            .Select(x => new
        {
            StageTitle = x.Title,
            StagePercentage = x.Percentage,
                //StageAmount = _project.Fee * x.Percentage / 100.0m,
            StageAmount = _workOrder.Amount * x.Percentage / 100.0m,
            StageStatus = statusMasters.Any(m => m.Value == x.StatusFlag) ? statusMasters.FirstOrDefault(m => m.Value == x.StatusFlag).Title : "",

            }).GroupJoin(previousBills, a => a.StageTitle, b => b.StageTitle, (a, b) => new
            {
                Stage=a,
                Bills=b.DefaultIfEmpty()
            }).SelectMany(join=>join.Bills.DefaultIfEmpty(), (a,b)=>new BillReportData{
                StageTitle=a.Stage.StageTitle,
                StagePercentage=a.Stage.StagePercentage,
                StageAmount=a.Stage.StageAmount,
                StageStatus = b!=null && b.PaymentDate!=null ? "PAYMENT RECEVIED" : (b!=null ? "PAYMENT DUE" : "UN-BILLED"),
                BillNo=b!=null ? b.BillNo : null,
                BillPercentage=b!=null? b.BillPercentage :0,
                BillDate=b!=null ? b.BillDate :null,
                BillAmount=b!=null ? b.BillAmount : a.Stage.StageAmount,
                DueAmount=b!=null ? b.DueAmount : a.Stage.StageAmount,
                CGSTAmount=b!=null ? b.CGSTAmount :a.Stage.StageAmount * GSTRate / 100.0m,
                PayableAmount=b!=null ? b.PayableAmount : a.Stage.StageAmount + (a.Stage.StageAmount * GSTRate / 100.0m),
                PaymentDate=b!=null ? b.PaymentDate :null,
                PaymentDetail=b!=null ? b.PaymentDetail :null
            });




        HashSet<String> _subreports = new HashSet<string>();


        var _reportProperties = new HashSet<ReportProperties>
                {
                    new ReportProperties(){ PropertyName = "ReportTitle", PropertyValue = _bill.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_TAX_INVOICE ? $"TAX INVOICE" : "PROFORMA INVOICE" },
                     new ReportProperties(){ PropertyName = "ShowLetterHead", PropertyValue = showLetterHead.ToString() },
                  
                };


        var reportServiceApi = await _sharedService.GetPresetValue(McvConstant.RDLC_PROCESSOR_API);
        var _reportContainerUrl = await _sharedService.GetPresetValue(McvConstant.RDLC_REPORT_CONTAINER_URL);
        var DEVMODE = Convert.ToBoolean((await _sharedService.GetPresetValue(McvConstant.DEVMODE)));

        var _reportPath = $"Invoice.rdlc";

        var _reportDef = new ReportDefinition()
        {
            ReportName = "Invoice",
            ReportPath = DEVMODE ? $"{_reportContainerUrl}DEV/{_reportPath}" : $"{_reportContainerUrl}{_reportPath}",

            ReportDataSet = DataTools.ToDataTable<BillReportData>(data),
            ReportProperties = _reportProperties,
            Filename = _bill.TypeFlag == McvConstant.PROJECT_BILL_TYPEFLAG_TAX_INVOICE ? $"TAX INVOICE-{_bill.TaxInvoiceNo.Replace("/", "-")}" : $"PROFORMA INVOICE-{_bill.ProformaInvoiceNo.Replace("/", "-")}",

        };
        _reportDef.SubReports.Add(new ReportDefinition()
        {
           ReportName = "InvoicePaymentHistory",
           ReportPath = DEVMODE ? $"{_reportContainerUrl}DEV/InvoicePaymentHistory.rdlc" : $"{_reportContainerUrl}InvoicePaymentHistory.rdlc",

           ReportDataSet = DataTools.ToDataTable(projectStageData),
        });
        //_reportDef.SubReports.Add(new ReportDefinition()
        //{
        //    ReportName = "BillSubAreas",
        //    ReportPath = DEVMODE ? $"{_reportContainerUrl}DEV/BillSubAreas.rdlc" : $"{_reportContainerUrl}BillSubAreas.rdlc",
        //    ReportDataSet = DataTools.ToDataTable(subAreas),
        //});

        return await ReportClient.GenerateReport(_reportDef,reportServiceApi);

    }


}

public class BillReportData
{
    public string BillNo { get; set; }
    public string? SequenceNo { get; set; }
    public decimal BillPercentage { get; set; } = 0.0m;
    public decimal WorkPercentage { get; set; } = 0.0m;
    public string BillDate { get; set; }
    public decimal BillAmount { get; set; } = 0.0m;
    public decimal PreviousBillAmount { get; set; } = 0.0m;
    public decimal DueAmount { get; set; } = 0.0m;
    public decimal IGSTShare { get; set; } = 0.0m;
    public decimal IGSTAmount { get; set; } = 0.0m;
    public decimal CGSTShare { get; set; } = 0.0m;
    public decimal CGSTAmount { get; set; } = 0.0m;
    public decimal SGSTShare { get; set; } = 0.0m;
    public decimal SGSTAmount { get; set; } = 0.0m;

    public decimal PayableAmount { get; set; } = 0.0m;
    public string? AmountInWords { get; set; }

    public bool IsIGSTApplicable { get; set; }
    public int TypeFlag { get; set; }
    public string? ProjectCode { get; set; }
    public string? ProjectTitle { get; set; }
    public string? ProjectLocation { get; set; }
    public string? HSN { get; set; }
    public string? ReverseTaxCharges { get; set; }

    public decimal ProjectFee { get; set; } = 0.0m;

    public string? ClientName { get; set; }
    public string? ClientAddress { get; set; }
    public string? ClientGSTIN { get; set; }
    public string? ClientPAN { get; set; }
    public string? ClientTAN { get; set; }
    public string? ClientGSTStateCode { get; set; }

    public string? CompanyName { get; set; }
    public string? CompanyAddress { get; set; }
    public string? CompanyGSTIN { get; set; }
    public string? CompanyPAN { get; set; }
    public string? CompanyTAN { get; set; }
    public string? CompanyUDHYAM { get; set; }
    public string? CompanyGSTStateCode { get; set; }
    public string? CompanyLogoUrl { get; set; }
    public string? CompanyBank { get; set; }
    public string? CompanyBankBranch { get; set; }
    public string? CompanyBankIFSCCode { get; set; }
    public string? CompanySwiftCode { get; set; }
    public string? CompanyBankAccount { get; set; }
    public string? CompanySignStampUrl { get; set; }

    public string? WorkOrderDate { get; set; }
    public string? WorkOrderNo { get; set; }

    public string? StageTitle { get; set; }
    public decimal StagePercentage { get; set; }
    public decimal StageAmount { get; set; }
    public string? StageStatus { get; set; }

    public string? PaymentDate { get; set; }
    public string? PaymentDetail { get; set; }
}

