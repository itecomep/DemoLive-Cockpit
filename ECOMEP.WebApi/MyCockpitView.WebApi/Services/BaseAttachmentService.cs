
using System.Data;
using MyCockpitView.WebApi.AzureBlobsModule;
using Microsoft.EntityFrameworkCore;

using MyCockpitView.Utility.Common;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.ImageEncodeClient;
using Microsoft.AspNetCore.StaticFiles;
using MyCockpitView.WebApi.Exceptions;


namespace MyCockpitView.WebApi.Services;

public interface IBaseAttachmentService<T> : IBaseEntityService<T> where T : class
{

}

public class BaseAttachmentService<T> : BaseEntityService<T>, IBaseAttachmentService<T> where T : BaseBlobEntity, new()
{
    public BaseAttachmentService(
        EntitiesContext db
        ) : base(db)
    {
    }

    public IQueryable<T> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<T> _query = base.Get(Filters);

        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("extension", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<T>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("extension", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x.Filename.Contains(_item.Value));
                }
                _query = _query.Where(predicate);
            }


        }

        if (Search != null && Search != string.Empty)
        {
            var _keywords = Search.Split(' ');

            foreach (var _key in _keywords)
            {
                _query = _query
                     .Where(x => x.Filename.ToLower().Contains(_key.ToLower())

                     || x._searchTags.ToLower().Contains(_key.ToLower())
                                              );
            }
        }


        if (Sort != null && Sort != string.Empty)
        {
            switch (Sort.ToLower())
            {
                case "createddate":
                    return _query
                            .OrderBy(x => x.Created);

                case "createddate desc":
                    return _query
                            .OrderByDescending(x => x.Created);

                case "orderflag":
                    return _query
                            .OrderBy(x => x.OrderFlag);
            }
        }

        return _query.OrderBy(x => x.OrderFlag);

    }

    public async Task<int> Create(T entity)
    {
        if (!entity.IsFolder)
        {
            var contentTypeProvider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!contentTypeProvider.TryGetContentType(entity.Filename, out contentType))
            {
                contentType = "application/octet-stream";
            }
            entity.ContentType = contentType;
            if (entity.Url == null) throw new EntityServiceException($"File url not found!");
            if (McvConstant.IMAGE_FILE_EXTENSIONS.Contains(DataTools.GetFileExtension(entity.Filename).ToLower()))
            {
                var sharedService = new SharedService(db);
                var apiUrl = await sharedService.GetPresetValue(McvConstant.IMAGE_PROCESSOR_RESIZE_API);
                entity.ThumbUrl = ImageUtility.ImageResize(apiUrl, entity.Url);

            }
            //else
            //if (McvConstant.VIDEO_FILE_EXTENSIONS.Contains(DataTools.GetFileExtension(entity.Filename).ToLower()))
            //{
            //    var apiUrl = await sharedService.GetPresetValue(McvConstant.VIDEO_ENCODE_FUNCTION_API);
            //    var azureStorageKey = await sharedService.GetPresetValue(McvConstant.AZURE_STORAGE_KEY);
            //    VideoUtility.EncodeVideo(apiUrl, azureStorageKey, entity.Container, entity.BlobPath);
            //    var ext = entity.Filename.Substring(entity.Filename.LastIndexOf('.'));
            //    entity.Filename = entity.Filename.Replace(ext, ".mp4");
            //    entity.Url = entity.Url.Replace(ext, ".mp4");
            //    entity.ThumbUrl = entity.Url.Replace(ext, ".jpg");
            //}
        }

        return await base.Create(entity);

    }

    public async Task Delete(int Id)
    {
        //var sharedService = new SharedService(db);
        //var azureStorageKey = await sharedService.GetPresetValue(McvConstant.AZURE_STORAGE_KEY);
        //var azureStorageContainer = await sharedService.GetPresetValue(McvConstant.BLOB_CONTAINER_ATTACHMENTS);
        //var _attachment = await db.Set<T>().SingleOrDefaultAsync(x => x.ID == Id);
        //if (_attachment == null) throw new EntityServiceException($"{nameof(T)} not found!");

        //var _azureBlobService = new AzureBlobService();
        //await _azureBlobService.DeleteBlobByUrlAsync(azureStorageKey, azureStorageContainer, _attachment.Url);

        //if (_attachment.ThumbUrl != null)
        //{
        //    await _azureBlobService.DeleteBlobByUrlAsync(azureStorageKey, azureStorageContainer, _attachment.ThumbUrl);
        //}

        await base.Delete(Id);

    }

   


}

