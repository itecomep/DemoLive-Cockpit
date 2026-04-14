using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.WebApi.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.ProjectModule.Services;
public interface IProjectAttachmentService : IBaseAttachmentService<ProjectAttachment>
{
    Task CreateProjectRootFolders(int ProjectID);
}

public class ProjectAttachmentService : BaseAttachmentService<ProjectAttachment>, IProjectAttachmentService
{

    public ProjectAttachmentService(EntitiesContext db) : base(db)
    {
    }

    public IQueryable<ProjectAttachment> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<ProjectAttachment> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<ProjectAttachment>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("ProjectID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ProjectID == isNumeric);
                }
                _query = _query.Where(predicate);
            }
           
        }

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x._searchTags.ToLower().Contains(_key)
                || x.Title.ToLower().Contains(_key)
                      || x.Filename.ToLower().Contains(_key)
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

            }

            return _orderedQuery;
        }

        return _query
                      .OrderByDescending(x => x.Created);

    }

    public async Task CreateProjectRootFolders(int ProjectID)
    {
        var sharedService = new SharedService(db);

        var projectRootFolderJSON = await sharedService.GetPresetValue(McvConstant.PROJECT_FOLDERS);

        var projectFolders = JsonSerializer.Deserialize<List<ProjectFolderMaster>>(projectRootFolderJSON);

        async Task<ProjectAttachment> CreateFolderAsync(ProjectFolderMaster folder, int? parentID, string? parentPath,string? parentName)
        {
            // Check if the folder already exists
            var existingFolder = await db.ProjectAttachments
                .FirstOrDefaultAsync(f =>
                    f.ProjectID == ProjectID &&
                    f.ParentID == parentID &&
                    f.Filename == folder.Name &&
                    f.IsFolder);

            if (existingFolder != null)
            {
                return existingFolder; // Return the existing folder's ID
            }

            // Create the new folder
            var newFolder = new ProjectAttachment
            {
                ProjectID = ProjectID,
                IsFolder = true,
                ParentID = parentID,
                Filename = folder.Name,
                Created=DateTime.UtcNow,
                Modified=DateTime.UtcNow,
                FolderPath=parentPath!=null? parentPath+"/"+parentName : parentName,
                IsReadOnly=true
            };

            db.ProjectAttachments.Add(newFolder);
            await db.SaveChangesAsync(); // Save to get the generated ID

            return newFolder;
        }

        async Task CreateFoldersRecursivelyAsync(ProjectFolderMaster folder, int? parentID, string? parentPath, string? parentName)
        {
            // Create the current folder and get its ID
            var currentFolder = await CreateFolderAsync(folder, parentID,parentPath,parentName);

            // Recursively create children
            foreach (var child in folder.Children)
            {
                await CreateFoldersRecursivelyAsync(child, currentFolder.ID,currentFolder.FolderPath,currentFolder.Filename);
            }
        }

        foreach (var rootFolder in projectFolders)
        {
            await CreateFoldersRecursivelyAsync(rootFolder,null,null,null);
        }
    }



}

public class ProjectFolderMaster
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("parent")]
    public string? Parent { get; set; }

    [JsonPropertyName("children")]
    public List<ProjectFolderMaster> Children { get; set; } = new List<ProjectFolderMaster>();
}