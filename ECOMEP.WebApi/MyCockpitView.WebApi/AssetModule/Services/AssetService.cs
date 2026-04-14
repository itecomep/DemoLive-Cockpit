using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.AssetModule.Entities;


//using MyCockpitView.WebApi.DTO;
using MyCockpitView.WebApi.Exceptions;
//using MyCockpitView.WebApi.Filters;
using MyCockpitView.WebApi.Services;
//using MyCockpitView.WebApi.Utilities;

namespace MyCockpitView.WebApi.AssetModule.Services
{

    public interface IAssetService : IBaseEntityService<Asset>
    {
        public Task<int> Create(Asset entity);
        public Task CreateByMaster(string Category, string Attribute, string InputType, string InputOptions, bool IsRequired);
        public Task Update(Asset UpdatedEntity);
        public Task Delete(int Id);
        public Task DeleteByMaster(string Category, string Attribute);
        public Task<AssetCode> GetNextCode(DateTime createdDate, int typeFlag);
        public  Task<IEnumerable<string>> GetAttibuteValueOptions(string attributeKey);
        public Task ScaffoldByMaster();
        public Task UpdateByMaster(string Category, string Attribute, string NewAttribute, string NewInputType, string NewInputOptions, bool IsRequired);
        public IQueryable<Asset> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null);
        public Task UpdateAssetCategory(string oldCategory, string newCategory);
    }
    public class AssetService : BaseEntityService<Asset>, IAssetService
    {
        private readonly string username;

        public AssetService(EntitiesContext db) : base(db) { }




        public IQueryable<Asset> Get(IEnumerable<QueryFilter> Filters = null, string Search = null, string Sort = null)
        {
            IQueryable<Asset> query = base.Get(Filters);

            // Apply filters
            if (Filters != null)
            {
                if (Filters.Any(x => x.Key.Equals("deleted", StringComparison.OrdinalIgnoreCase)))
                {
                    query = db.Assets
                        .AsNoTracking()
                        .Where(x => !x.IsDeleted);
                }

                if (Filters.Any(x => x.Key.Equals("category", StringComparison.OrdinalIgnoreCase)))
                {
                    var predicate = PredicateBuilder.False<Asset>();
                    foreach (var item in Filters.Where(x => x.Key.Equals("category", StringComparison.OrdinalIgnoreCase)))
                    {
                        predicate = predicate.Or(x => x.Category.Contains(item.Value));
                    }
                    query = query.Where(predicate);
                }
            }

            if (!string.IsNullOrEmpty(Search))
            {
                var key = Search.Trim();
                query = query
                    .Include(x => x.Attributes)
                    .Where(x => x.Title.ToLower().Contains(key.ToLower())
                        || x.Subtitle.ToLower().Contains(key.ToLower())
                        || x.Code.ToLower().Contains(key.ToLower())
                        || x._searchTags.ToLower().Contains(key.ToLower())
                        || x.Attributes.Any(a => a.AttributeKey.ToLower().Contains(key.ToLower()))
                        || x.Attributes.Any(a => a.AttributeValue.ToLower().Contains(key.ToLower())));
            }

            if (!string.IsNullOrEmpty(Sort))
            {
                switch (Sort.ToLower())
                {
                    case "createddate":
                        return query.OrderBy(x => x.Created);

                    case "modifieddate":
                        return query.OrderBy(x => x.Modified);

                    case "createddate desc":
                        return query.OrderByDescending(x => x.Created);

                    case "modifieddate desc":
                        return query.OrderByDescending(x => x.Modified);
                }
            }

            return query.OrderBy(x => x.Subtitle);
        }

        public async Task<int> Create(Asset Entity)
        {
            var nextCodeData = await GetNextCode(DateTime.UtcNow, Entity.TypeFlag);
            Entity.CodeFlag = nextCodeData.CodeFlag;
            Entity.Code = nextCodeData.Code;

            if (string.IsNullOrEmpty(Entity.Title))
                throw new EntityServiceException("Title is required. Please enter proper title!");

            return await base.Create(Entity);
        }

        public async Task Update(Asset UpdatedEntity)
        {
            if (UpdatedEntity == null)
                throw new EntityServiceException("Object is null!");

            var entity = await db.Assets
                .Include(x => x.Attributes)
                .SingleOrDefaultAsync(x => x.ID == UpdatedEntity.ID);

            if (entity == null)
                throw new EntityServiceException("Object is null!");

            // Update or Add attributes
            foreach (var updatedAttr in UpdatedEntity.Attributes)
            {
                var existingAttr = entity.Attributes
                    .Where(x => !x.IsDeleted)
                    .FirstOrDefault(attr => attr.AttributeKey == updatedAttr.AttributeKey);

                if (existingAttr != null)
                {
                    existingAttr.AttributeValue = updatedAttr.AttributeValue;
                    existingAttr.OrderFlag = updatedAttr.OrderFlag;
                }
                else
                {
                    entity.Attributes.Add(updatedAttr);
                }
            }

            // Remove attributes not present in the updated entity
            foreach (var existingAttr in entity.Attributes.Where(x => !x.IsDeleted).ToList())
            {
                if (!UpdatedEntity.Attributes.Any(attr => attr.AttributeKey == existingAttr.AttributeKey))
                {
                    entity.Attributes.Remove(existingAttr);
                    db.Entry(existingAttr).State = EntityState.Deleted;
                }
            }

            db.Entry(entity).CurrentValues.SetValues(UpdatedEntity);
            await db.SaveChangesAsync();
        }

        public async Task Delete(int Id)
        {
            var attributes = await db.AssetAttributes
                .AsNoTracking()
                .Where(x => !x.IsDeleted)
                .Where(x => x.AssetID == Id)
                .Select(x => x.ID)
                .ToListAsync();

            var attributeService = new BaseEntityService<AssetAttribute>(db);
            foreach (var child in attributes)
                await attributeService.Delete(child);

            var attachments = await db.AssetAttachments
                .AsNoTracking()
                .Where(x => !x.IsDeleted)
                .Where(x => x.AssetID == Id)
                .Select(x => x.ID)
                .ToListAsync();

            var attachmentService = new BaseAttachmentService<AssetAttachment>(db);
            foreach (var child in attachments)
                await attachmentService.Delete(child);

            await base.Delete(Id);
        }

        public async Task<AssetCode> GetNextCode(DateTime createdDate, int typeFlag)
        {
            var currentYearStart = new DateTime(createdDate.Year, 1, 1);
            var count = await db.Assets
                .AsNoTracking()
                .Where(x => !x.IsDeleted)
                .Where(x => x.Created > currentYearStart && x.TypeFlag == typeFlag)
                .AnyAsync()
                    ? await db.Assets
                        .AsNoTracking()
                        .Where(x => !x.IsDeleted)
                        .Where(x => x.Created > currentYearStart && x.TypeFlag == typeFlag)
                        .MaxAsync(x => x.CodeFlag)
                    : 0;

            var codeFlag = count + 1;
            return new AssetCode
            {
                CodeFlag = codeFlag,
                Code = $"{currentYearStart:yy}{codeFlag:D3}"
            };
        }

        public async Task<IEnumerable<string>> GetAttibuteValueOptions(string attributeKey)
        {
            return await db.AssetAttributes
                .Where(x => !x.IsDeleted)
                .Where(x => x.AttributeValue != null && x.AttributeValue != string.Empty
                    && x.AttributeKey == attributeKey)
                .Select(x => x.AttributeValue)
                .Where(x => x != null)
                .Distinct()
                .ToListAsync();
        }

        public async Task CreateByMaster(string Category, string Attribute, string InputType, string InputOptions, bool IsRequired)
        {
            var assets = await Get()
                .Include(x => x.Attributes)
                .Where(x => x.Category == Category)
                .ToListAsync();

            foreach (var asset in assets)
            {
                if (!asset.Attributes.Any(x => x.AttributeKey.ToLower() == Attribute.ToLower()))
                {
                    var newAttribute = new AssetAttribute
                    {
                        AssetID = asset.ID,
                        AttributeKey = Attribute,
                        InputOptions = InputOptions,
                        InputType = InputType,
                        IsRequired = IsRequired
                    };
                    db.Entry(newAttribute).State = EntityState.Added;
                    asset.Attributes.Add(newAttribute);
                }
            }
            await db.SaveChangesAsync();
        }

        public async Task UpdateByMaster(string Category, string Attribute, string NewAttribute, string NewInputType, string NewInputOptions, bool IsRequired)
        {
            var assetAttributes = await Get()
                .Include(x => x.Attributes)
                .Where(x => x.Category == Category)
                .SelectMany(x => x.Attributes)
                .Where(x => x.AttributeKey == Attribute)
                .Where(x => !x.IsDeleted)
                .ToListAsync();

            foreach (var attribute in assetAttributes)
            {
                attribute.AttributeKey = NewAttribute;
                attribute.InputType = NewInputType;
                attribute.InputOptions = NewInputOptions;
                attribute.IsRequired = IsRequired;
                db.Entry(attribute).State = EntityState.Modified;
            }
            await db.SaveChangesAsync();
        }

        public async Task DeleteByMaster(string Category, string Attribute)
        {
            var assetAttributes = await Get()
                .Include(x => x.Attributes)
                .Where(x => x.Category == Category)
                .SelectMany(x => x.Attributes)
                .Where(x => x.AttributeKey == Attribute)
                .Where(x => !x.IsDeleted)
                .Where(x => string.IsNullOrEmpty(x.AttributeValue))
                .ToListAsync();

            foreach (var attribute in assetAttributes)
            {
                db.Entry(attribute).State = EntityState.Deleted;
            }
            await db.SaveChangesAsync();
        }

        public async Task ScaffoldByMaster()
        {
            var masterGroups = await db.AssetAttributeMasters
                .AsNoTracking()
                .Where(x => !x.IsDeleted)
                .GroupBy(x => x.Category)
                .Select(x => new
                {
                    Category = x.Key,
                    Attributes = x.ToList()
                })
                .ToListAsync();

            foreach (var master in masterGroups)
            {
                Console.WriteLine();
            }
        }

        public async Task UpdateAssetCategory(string oldCategory, string newCategory)
        {
            if (string.IsNullOrEmpty(oldCategory) || string.IsNullOrEmpty(newCategory))
                return;

            var assets = await Get()
                .Where(x => x.Category == oldCategory)
                .ToListAsync();

            if (assets == null || !assets.Any())
                return;

            foreach (var asset in assets)
            {
                if (asset != null)
                {
                    asset.Category = newCategory;
                    db.Entry(asset).State = EntityState.Modified;
                }
            }

            await db.SaveChangesAsync();
        }
    }

    public class AssetSummary
    {
        public int PrimaryAssetID { get; set; }
        public int ID { get; set; }
        public string Category { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
                  public string Code { get; set; }
              public string Status  { get; set; }
               public string AttributeKey { get; set; }
                public string  AttributeValue  { get; set; }
    public int AttributeOrderFlag  { get; set; }
public string AttributeInputType { get; set; }
public string ImageUrl { get; set; }

      public bool HideSecondaryAssets { get; set; }
                    public string AttributeGroup { get; set; }

    }

    public class AssetCode
    {
        public int CodeFlag { get; set; }
        public string Code { get; set; }
    }
}