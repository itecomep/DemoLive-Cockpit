using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;
using MyCockpitView.Utility.Common;
using MyCockpitView.Utility.RDLCClient;
using MyCockpitView.WebApi.AssetModule.Dtos;
using MyCockpitView.WebApi.AssetModule.Entities;
using MyCockpitView.WebApi.AssetModule.Services;
using MyCockpitView.WebApi.ContactModule.Dtos;
using MyCockpitView.WebApi.ContactModule.Services;
using MyCockpitView.WebApi.Responses;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace MyCockpitView.WebApi.AssetModule.Controllers;

[Route("[controller]")]
[ApiController]
public class AssetController : ControllerBase
{
    private readonly IAssetService service;
    private readonly EntitiesContext db;
    private readonly IContactService contactService;
    private readonly IMapper mapper;
    private readonly ILogger<AssetController> logger;

    public AssetController(
         ILogger<AssetController> logger,
         EntitiesContext entitiesContext,
         IAssetService assetService,
         IContactService contactService,
         IMapper mapper)
    {
        this.logger = logger;
        this.db = entitiesContext;
        this.service = assetService;
        this.contactService = contactService;
        this.mapper = mapper;
    }
    [HttpGet("Pages")]
    public async Task<IActionResult> GetPages(
        int page = 0,
        int pageSize = 10,
        string? Filters = null,
        string? Search = null,
        string? Sort = null)
    {
        try
        {
            var query = service.Get(
                Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,
                Search,
                Sort);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (decimal)pageSize);

            var entities = await query
                .AsNoTracking()
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (!entities.Any())
            {
                return Ok(new PagedResponse<AssetDto>(new List<AssetDto>(), totalCount, totalPages));
            }

            var assetIds = entities.Select(x => x.ID).ToList();

            // Map to DTOs (base properties only)
            var results = mapper.Map<List<AssetDto>>(entities);

            // Get Attachments for paged assets
            var allAttachments = await db.AssetAttachments
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            // Get Attributes for paged assets
            var allAttributes = await db.AssetAttributes
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            // Get Vendors for paged assets
            var allVendors = await db.AssetVendors
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            // Get Vendor Contacts if needed
            var contactIds = allVendors
                .Where(v => v.ContactID.HasValue)
                .Select(v => v.ContactID.Value)
                .Distinct()
                .ToList();

            var contacts = new Dictionary<int, ContactDto>();
            if (contactIds.Any())
            {
                var contactEntities = await contactService.Get()
                    .AsNoTracking()
                    .Where(x => contactIds.Contains(x.ID))
                    .ToListAsync();

                foreach (var contact in contactEntities)
                {
                    contacts[contact.ID] = mapper.Map<ContactDto>(contact);
                }
            }

            // Get Schedules WITHOUT Include
            var allSchedules = await db.AssetSchedules
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            var scheduleIds = allSchedules.Select(s => s.ID).ToList();

            var scheduleContacts = new Dictionary<int, ContactDto>();
            var scheduleAttachments = new List<AssetScheduleAttachment>();
            var scheduleComponents = new List<AssetScheduleComponent>();

            if (scheduleIds.Any())
            {
                // Load schedule contacts separately
                var scheduleContactIds = allSchedules
                    .Where(s => s.ContactID.HasValue)
                    .Select(s => s.ContactID.Value)
                    .Distinct()
                    .ToList();

                if (scheduleContactIds.Any())
                {
                    var scheduleContactEntities = await contactService.Get()
                        .AsNoTracking()
                        .Where(x => scheduleContactIds.Contains(x.ID))
                        .ToListAsync();

                    foreach (var contact in scheduleContactEntities)
                    {
                        scheduleContacts[contact.ID] = mapper.Map<ContactDto>(contact);
                    }
                }

                // Load schedule attachments separately
                scheduleAttachments = await db.AssetScheduleAttachments
                    .AsNoTracking()
                    .Where(x => scheduleIds.Contains(x.AssetScheduleID) && !x.IsDeleted)
                    .ToListAsync();

                // Load schedule components separately
                scheduleComponents = await db.AssetScheduleComponents
                    .AsNoTracking()
                    .Where(x => scheduleIds.Contains(x.ScheduleID) && !x.IsDeleted)
                    .ToListAsync();
            }

            // Get Asset Links where assets are PRIMARY
            var allPrimaryLinks = await db.AssetLinks
                .AsNoTracking()
                .Where(al => assetIds.Contains(al.PrimaryAssetID) && !al.IsDeleted)
                .ToListAsync();

            // Get linked assets (secondary assets)
            var linkedAssetIds = allPrimaryLinks.Select(x => x.SecondaryAssetID).Distinct().ToList();

            var linkedAssets = new Dictionary<int, Asset>();
            var linkedAssetAttributes = new List<AssetAttribute>();

            if (linkedAssetIds.Any())
            {
                linkedAssets = await db.Assets
                    .AsNoTracking()
                    .Where(a => linkedAssetIds.Contains(a.ID) && !a.IsDeleted)
                    .ToDictionaryAsync(a => a.ID);

                linkedAssetAttributes = await db.AssetAttributes
                    .AsNoTracking()
                    .Where(x => linkedAssetIds.Contains(x.AssetID) && !x.IsDeleted)
                    .ToListAsync();
            }

            // Get TypeValues
            var flagValues = await db.TypeMasters
                .AsNoTracking()
                .Where(x => x.Entity.ToLower() == nameof(Asset).ToLower())
                .ToListAsync();

            // Populate each result
            foreach (var result in results)
            {
                // Set TypeValue
                result.TypeValue = flagValues
                    .FirstOrDefault(x => x.Value == result.TypeFlag)?.Title ?? string.Empty;

                // Set Attachments
                result.Attachments = allAttachments
                    .Where(x => x.AssetID == result.ID)
                    .Select(x => mapper.Map<AssetAttachmentDto>(x))
                    .ToList();

                // Set Attributes - CRITICAL: Set Asset to null
                result.Attributes = allAttributes
                    .Where(x => x.AssetID == result.ID)
                    .Select(x =>
                    {
                        var dto = mapper.Map<AssetAttributeDto>(x);
                        dto.Asset = null; // Break circular reference
                        return dto;
                    })
                    .ToList();

                // Set Vendors
                result.Vendors = allVendors
                    .Where(x => x.AssetID == result.ID)
                    .Select(v =>
                    {
                        var dto = mapper.Map<AssetVendorDto>(v);
                        return dto;
                    })
                    .ToList();

                // Assign vendor contacts
                foreach (var vendor in result.Vendors)
                {
                    if (vendor.ContactID.HasValue && contacts.ContainsKey(vendor.ContactID.Value))
                    {
                        vendor.Contact = contacts[vendor.ContactID.Value];
                    }
                }

                // Set Schedules
                result.Schedules = allSchedules
                    .Where(x => x.AssetID == result.ID)
                    .Select(s =>
                    {
                        var dto = mapper.Map<AssetScheduleDto>(s);
                        return dto;
                    })
                    .ToList();

                // Assign schedule details
                foreach (var schedule in result.Schedules)
                {
                    // Set schedule contact
                    if (schedule.ContactID.HasValue && scheduleContacts.ContainsKey(schedule.ContactID.Value))
                    {
                        schedule.Contact = scheduleContacts[schedule.ContactID.Value];
                    }

                    // Set schedule attachments
                    schedule.Attachments = scheduleAttachments
                        .Where(x => x.AssetScheduleID == schedule.ID)
                        .Select(x => mapper.Map<AssetScheduleAttachmentDto>(x))
                        .ToList();

                    // Set schedule components
                    schedule.Components = scheduleComponents
                        .Where(x => x.ScheduleID == schedule.ID)
                        .Select(x => mapper.Map<AssetScheduleComponentDto>(x))
                        .ToList();
                }

                // Initialize arrays
                result.PrimaryAssets = new List<AssetLinkDto>();
                result.SecondaryAssets = new List<AssetLinkDto>();

                // Get AssetLinks where current asset is PRIMARY
                var assetLinks = allPrimaryLinks.Where(al => al.PrimaryAssetID == result.ID).ToList();

                if (assetLinks.Any())
                {
                    // Build the SecondaryAssets array
                    foreach (var assetLink in assetLinks)
                    {
                        if (linkedAssets.TryGetValue(assetLink.SecondaryAssetID, out var secondaryAsset))
                        {
                            // Create AssetLinkDto
                            var assetLinkDto = mapper.Map<AssetLinkDto>(assetLink);

                            // Create full AssetDto for the secondary asset
                            var secondaryAssetDto = mapper.Map<AssetDto>(secondaryAsset);

                            // Add attributes to secondary asset
                            secondaryAssetDto.Attributes = linkedAssetAttributes
                                .Where(x => x.AssetID == secondaryAsset.ID)
                                .Select(x =>
                                {
                                    var attrDto = mapper.Map<AssetAttributeDto>(x);
                                    attrDto.Asset = null; // Break circular reference
                                    return attrDto;
                                })
                                .ToList();

                            // Prevent circular dependencies
                            secondaryAssetDto.PrimaryAssets = new List<AssetLinkDto>();
                            secondaryAssetDto.SecondaryAssets = new List<AssetLinkDto>();
                            secondaryAssetDto.Attachments = new List<AssetAttachmentDto>();
                            secondaryAssetDto.Vendors = new List<AssetVendorDto>();
                            secondaryAssetDto.Schedules = new List<AssetScheduleDto>();

                            // Attach secondary asset to the link
                            assetLinkDto.SecondaryAsset = secondaryAssetDto;

                            // Add to result.SecondaryAssets
                            result.SecondaryAssets.Add(assetLinkDto);
                        }
                    }
                }
            }

            return Ok(new PagedResponse<AssetDto>(results, totalCount, totalPages));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching assets");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while fetching assets.",
                Details = ex.Message
            });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] AssetDto dto)
    {
        try
        {
            var entity = mapper.Map<Asset>(dto);
            var id = await service.Create(entity);

            // 1. Get main asset WITHOUT any navigation properties
            var asset = await service.Get()
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.ID == id);

            if (asset == null)
                return BadRequest("Asset was not created.");

            // 2. Map to DTO
            var result = mapper.Map<AssetDto>(asset);

            // 3. Get Attachments independently
            result.Attachments = await db.AssetAttachments
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .Select(x => mapper.Map<AssetAttachmentDto>(x))
                .ToListAsync();

            // 4. Get Attributes independently
            var attributes = await db.AssetAttributes
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Attributes = attributes.Select(x =>
            {
                var attrDto = mapper.Map<AssetAttributeDto>(x);
                attrDto.Asset = null; // Explicitly set to null to break any cycle
                return attrDto;
            }).ToList();

            // 5. Get Vendors independently
            var vendors = await db.AssetVendors
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Vendors = mapper.Map<List<AssetVendorDto>>(vendors);

            // 6. Get Vendor Contacts if needed
            if (result.Vendors.Any())
            {
                var contactIds = result.Vendors
                    .Where(v => v.ContactID.HasValue)
                    .Select(v => v.ContactID.Value)
                    .ToList();

                if (contactIds.Any())
                {
                    var contacts = await contactService.Get()
                        .Where(x => contactIds.Contains(x.ID))
                        .ToListAsync();

                    foreach (var vendor in result.Vendors)
                    {
                        if (vendor.ContactID.HasValue)
                        {
                            vendor.Contact = mapper.Map<ContactDto>(
                                contacts.FirstOrDefault(x => x.ID == vendor.ContactID.Value)
                            );
                        }
                    }
                }
            }

            // 7. Get Schedules independently
            var schedules = await db.AssetSchedules
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .Include(s => s.Contact)
                .Include(s => s.Attachments.Where(a => !a.IsDeleted))
                .Include(s => s.Components.Where(c => !c.IsDeleted))
                .ToListAsync();

            result.Schedules = mapper.Map<List<AssetScheduleDto>>(schedules);

            // 8. Get Primary Asset Links
            var primaryLinks = await db.AssetLinks
                .Where(al => al.PrimaryAssetID == id && !al.IsDeleted)
                .ToListAsync();

            result.PrimaryAssets = new List<AssetLinkDto>();
            foreach (var link in primaryLinks)
            {
                var linkedAsset = await db.Assets
                    .Where(a => a.ID == link.SecondaryAssetID && !a.IsDeleted)
                    .Include(a => a.Attributes.Where(x => !x.IsDeleted))
                    .FirstOrDefaultAsync();

                if (linkedAsset != null)
                {
                    var linkDto = mapper.Map<AssetLinkDto>(link);
                    linkDto.SecondaryAsset = mapper.Map<AssetDto>(linkedAsset);
                    // Prevent further nesting
                    linkDto.SecondaryAsset.PrimaryAssets = new List<AssetLinkDto>();
                    linkDto.SecondaryAsset.SecondaryAssets = new List<AssetLinkDto>();
                    result.PrimaryAssets.Add(linkDto);
                }
            }

            // 9. Get Secondary Asset Links
            var secondaryLinks = await db.AssetLinks
                .Where(al => al.SecondaryAssetID == id && !al.IsDeleted)
                .ToListAsync();

            result.SecondaryAssets = new List<AssetLinkDto>();
            foreach (var link in secondaryLinks)
            {
                var linkedAsset = await db.Assets
                    .Where(a => a.ID == link.PrimaryAssetID && !a.IsDeleted)
                    .Include(a => a.Attributes.Where(x => !x.IsDeleted))
                    .FirstOrDefaultAsync();

                if (linkedAsset != null)
                {
                    var linkDto = mapper.Map<AssetLinkDto>(link);
                    linkDto.PrimaryAsset = mapper.Map<AssetDto>(linkedAsset);
                    // Prevent further nesting
                    linkDto.PrimaryAsset.PrimaryAssets = new List<AssetLinkDto>();
                    linkDto.PrimaryAsset.SecondaryAssets = new List<AssetLinkDto>();
                    result.SecondaryAssets.Add(linkDto);
                }
            }

            // 10. Get TypeValue
            var flagValues = await db.TypeMasters
                .Where(x => x.Entity.ToLower() == nameof(Asset).ToLower())
                .ToListAsync();

            result.TypeValue = flagValues
                .FirstOrDefault(x => x.Value == result.TypeFlag)?.Title ?? "";

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while creating asset");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while creating the asset.",
                Details = ex.Message
            });
        }
    }


    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            // 1. Get main asset WITHOUT any navigation properties
            var asset = await service.Get()
                .AsNoTracking()
                .SingleOrDefaultAsync(i => i.ID == id);

            if (asset == null)
            {
                return NotFound(new { Message = $"Asset with ID {id} not found." });
            }

            // 2. Map to DTO
            var result = mapper.Map<AssetDto>(asset);

            // 3. Get Attachments independently
            var attachments = await db.AssetAttachments
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Attachments = attachments.Select(x =>
            {
                var dto = mapper.Map<AssetAttachmentDto>(x);
                //dto.Asset = null;
                return dto;
            }).ToList();

            // 4. Get Attributes independently
            var attributes = await db.AssetAttributes
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Attributes = attributes.Select(x =>
            {
                var dto = mapper.Map<AssetAttributeDto>(x);
                dto.Asset = null;
                return dto;
            }).ToList();

            // 5. Get Vendors independently
            var vendors = await db.AssetVendors
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Vendors = vendors.Select(v =>
            {
                var dto = mapper.Map<AssetVendorDto>(v);
                //dto.Asset = null;
                return dto;
            }).ToList();

            // 6. Get Vendor Contacts if needed
            if (result.Vendors.Any())
            {
                var contactIds = result.Vendors
                    .Where(v => v.ContactID.HasValue)
                    .Select(v => v.ContactID.Value)
                    .ToList();

                if (contactIds.Any())
                {
                    var contacts = await contactService.Get()
                        .Where(x => contactIds.Contains(x.ID))
                        .ToListAsync();

                    foreach (var vendor in result.Vendors)
                    {
                        if (vendor.ContactID.HasValue)
                        {
                            vendor.Contact = mapper.Map<ContactDto>(
                                contacts.FirstOrDefault(x => x.ID == vendor.ContactID.Value)
                            );
                        }
                    }
                }
            }

            // 7. Get Schedules independently
            var schedules = await db.AssetSchedules
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .Include(s => s.Contact)
                .Include(s => s.Attachments.Where(a => !a.IsDeleted))
                .Include(s => s.Components.Where(c => !c.IsDeleted))
                .ToListAsync();

            result.Schedules = schedules.Select(s =>
            {
                var dto = mapper.Map<AssetScheduleDto>(s);
                //dto.Asset = null;
                return dto;
            }).ToList();

            // 8. Initialize both arrays
            result.PrimaryAssets = new List<AssetLinkDto>();  // Always empty - primary is self
            result.SecondaryAssets = new List<AssetLinkDto>(); // Will contain linked assets

            // 9. Get AssetLinks where current asset is PRIMARY
            // This means we want the SECONDARY assets (the linked ones)
            var assetLinks = await db.AssetLinks
                .AsNoTracking()
                .Where(al => al.PrimaryAssetID == id && !al.IsDeleted)
                .ToListAsync();

            if (assetLinks.Any())
            {
                // Get IDs of all secondary (linked) assets
                var secondaryAssetIds = assetLinks.Select(x => x.SecondaryAssetID).Distinct().ToList();

                // Load all secondary assets
                var secondaryAssets = await db.Assets
                    .AsNoTracking()
                    .Where(a => secondaryAssetIds.Contains(a.ID) && !a.IsDeleted)
                    .ToDictionaryAsync(a => a.ID);

                // Load attributes for secondary assets
                var secondaryAssetAttributes = await db.AssetAttributes
                    .AsNoTracking()
                    .Where(x => secondaryAssetIds.Contains(x.AssetID) && !x.IsDeleted)
                    .ToListAsync();

                // Build the SecondaryAssets array
                foreach (var assetLink in assetLinks)
                {
                    if (secondaryAssets.TryGetValue(assetLink.SecondaryAssetID, out var secondaryAsset))
                    {
                        // Create AssetLinkDto
                        var assetLinkDto = mapper.Map<AssetLinkDto>(assetLink);

                        // Create full AssetDto for the secondary asset
                        var secondaryAssetDto = mapper.Map<AssetDto>(secondaryAsset);

                        // Add attributes to secondary asset
                        secondaryAssetDto.Attributes = secondaryAssetAttributes
                            .Where(x => x.AssetID == secondaryAsset.ID)
                            .Select(x =>
                            {
                                var attrDto = mapper.Map<AssetAttributeDto>(x);
                                attrDto.Asset = null;
                                return attrDto;
                            })
                            .ToList();

                        // Prevent circular dependencies
                        secondaryAssetDto.PrimaryAssets = new List<AssetLinkDto>();
                        secondaryAssetDto.SecondaryAssets = new List<AssetLinkDto>();
                        secondaryAssetDto.Attachments = new List<AssetAttachmentDto>();
                        secondaryAssetDto.Vendors = new List<AssetVendorDto>();
                        secondaryAssetDto.Schedules = new List<AssetScheduleDto>();

                        // Attach secondary asset to the link
                        assetLinkDto.SecondaryAsset = secondaryAssetDto;

                        // Add to result.SecondaryAssets (NOT PrimaryAssets!)
                        result.SecondaryAssets.Add(assetLinkDto);
                    }
                }
            }

            // 10. Get TypeValue
            var flagValues = await db.TypeMasters
                .Where(x => x.Entity.ToLower() == nameof(Asset).ToLower())
                .ToListAsync();

            result.TypeValue = flagValues
                .FirstOrDefault(x => x.Value == result.TypeFlag)?.Title ?? "";

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching asset by ID {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = ex.Message });
        }
    }


    //[Authorize]
    //[HttpPut("{id}")]
    //public async Task<IActionResult> Put(int id, [FromBody] AssetDto dto)
    //{
    //    try
    //    {
    //        await service.Update(mapper.Map<Asset>(dto));

    //        // Step 1: Load the main asset with direct relationships only
    //        var asset = await service.Get()
    //            .AsTracking()  // ← ADD THIS - enables tracking to avoid cycle errors
    //            .Include(x => x.Attachments)
    //            .Include(x => x.Vendors)
    //            .Include(x => x.Attributes)
    //            .Include(x => x.Schedules).ThenInclude(c => c.Contact)
    //            .Include(x => x.Schedules).ThenInclude(c => c.Attachments)
    //            .Include(x => x.PrimaryAssets)      // ← STOP HERE - don't include nested
    //            .Include(x => x.SecondaryAssets)    // ← STOP HERE - don't include nested
    //            .SingleOrDefaultAsync(i => i.ID == id);

    //        // Step 2: Load related assets separately to avoid circular reference
    //        if (asset != null)
    //        {
    //            var primaryAssetIds = asset.PrimaryAssets.Select(pa => pa.SecondaryAssetID).ToList();
    //            var secondaryAssetIds = asset.SecondaryAssets.Select(sa => sa.PrimaryAssetID).ToList();

    //            await db.Assets
    //                .Where(a => primaryAssetIds.Contains(a.ID) || secondaryAssetIds.Contains(a.ID))
    //                .Include(a => a.Attributes)
    //                .LoadAsync();
    //        }

    //        if (asset == null)
    //            return BadRequest("Not Modified");

    //        var result = mapper.Map<AssetDto>(asset);

    //        var flagValues = await db.TypeMasters
    //         .Where(x => x.Entity.ToLower() == nameof(Asset).ToLower())
    //         .ToListAsync();

    //        result.TypeValue = flagValues.Any(x => x.Value == result.TypeFlag)
    //            ? flagValues.FirstOrDefault(x => x.Value == result.TypeFlag)?.Title ?? ""
    //            : "";

    //        return Ok(result);
    //    }
    //    catch (Exception ex)
    //    {
    //        logger.LogError(ex, "Error occurred while updating asset {Id}", id);
    //        return StatusCode(StatusCodes.Status500InternalServerError,
    //            new { Message = ex.Message });
    //    }
    //}
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] AssetDto dto)
    {
        try
        {
            if (id != dto.ID)
                return BadRequest("Invalid Asset ID.");

            await service.Update(mapper.Map<Asset>(dto));

            // 1. Load main asset WITHOUT navigation properties
            var asset = await service.Get()
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.ID == id);

            if (asset == null)
                return BadRequest("Not Modified");

            // 2. Map to DTO (base only)
            var result = mapper.Map<AssetDto>(asset);

            // 3. Attachments
            result.Attachments = await db.AssetAttachments
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .Select(x => mapper.Map<AssetAttachmentDto>(x))
                .ToListAsync();

            // 4. Attributes (break cycle)
            var attributes = await db.AssetAttributes
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Attributes = attributes.Select(x =>
            {
                var attrDto = mapper.Map<AssetAttributeDto>(x);
                attrDto.Asset = null;
                return attrDto;
            }).ToList();

            // 5. Vendors
            var vendors = await db.AssetVendors
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Vendors = vendors.Select(v =>
            {
                var vendorDto = mapper.Map<AssetVendorDto>(v);
                return vendorDto;
            }).ToList();

            // 6. Vendor Contacts
            if (result.Vendors.Any())
            {
                var contactIds = result.Vendors
                    .Where(v => v.ContactID.HasValue)
                    .Select(v => v.ContactID.Value)
                    .Distinct()
                    .ToList();

                if (contactIds.Any())
                {
                    var contactEntities = await contactService.Get()
                        .AsNoTracking()
                        .Where(x => contactIds.Contains(x.ID))
                        .ToListAsync();

                    var contacts = new Dictionary<int, ContactDto>();
                    foreach (var c in contactEntities)
                        contacts[c.ID] = mapper.Map<ContactDto>(c);

                    foreach (var vendor in result.Vendors)
                    {
                        if (vendor.ContactID.HasValue && contacts.ContainsKey(vendor.ContactID.Value))
                        {
                            vendor.Contact = contacts[vendor.ContactID.Value];
                        }
                    }
                }
            }

            // 7. Schedules (base)
            var schedules = await db.AssetSchedules
                .AsNoTracking()
                .Where(x => x.AssetID == id && !x.IsDeleted)
                .ToListAsync();

            result.Schedules = schedules.Select(s => mapper.Map<AssetScheduleDto>(s)).ToList();

            var scheduleIds = schedules.Select(x => x.ID).ToList();

            if (scheduleIds.Any())
            {
                // Schedule Contacts
                var scheduleContactIds = schedules
                    .Where(s => s.ContactID.HasValue)
                    .Select(s => s.ContactID.Value)
                    .Distinct()
                    .ToList();

                var scheduleContacts = new Dictionary<int, ContactDto>();

                if (scheduleContactIds.Any())
                {
                    var scheduleContactEntities = await contactService.Get()
                        .AsNoTracking()
                        .Where(x => scheduleContactIds.Contains(x.ID))
                        .ToListAsync();

                    foreach (var c in scheduleContactEntities)
                        scheduleContacts[c.ID] = mapper.Map<ContactDto>(c);
                }

                // Schedule Attachments
                var scheduleAttachments = await db.AssetScheduleAttachments
                    .AsNoTracking()
                    .Where(x => scheduleIds.Contains(x.AssetScheduleID) && !x.IsDeleted)
                    .ToListAsync();

                // Schedule Components
                var scheduleComponents = await db.AssetScheduleComponents
                    .AsNoTracking()
                    .Where(x => scheduleIds.Contains(x.ScheduleID) && !x.IsDeleted)
                    .ToListAsync();

                // Assign schedule details
                foreach (var scheduleDto in result.Schedules)
                {
                    if (scheduleDto.ContactID.HasValue && scheduleContacts.ContainsKey(scheduleDto.ContactID.Value))
                    {
                        scheduleDto.Contact = scheduleContacts[scheduleDto.ContactID.Value];
                    }

                    scheduleDto.Attachments = scheduleAttachments
                        .Where(x => x.AssetScheduleID == scheduleDto.ID)
                        .Select(x => mapper.Map<AssetScheduleAttachmentDto>(x))
                        .ToList();

                    scheduleDto.Components = scheduleComponents
                        .Where(x => x.ScheduleID == scheduleDto.ID)
                        .Select(x => mapper.Map<AssetScheduleComponentDto>(x))
                        .ToList();
                }
            }

            // 8. Initialize asset links arrays
            result.PrimaryAssets = new List<AssetLinkDto>();
            result.SecondaryAssets = new List<AssetLinkDto>();

            // 9. Get AssetLinks where current asset is PRIMARY
            var assetLinks = await db.AssetLinks
                .AsNoTracking()
                .Where(al => al.PrimaryAssetID == id && !al.IsDeleted)
                .ToListAsync();

            if (assetLinks.Any())
            {
                var secondaryAssetIds = assetLinks
                    .Select(x => x.SecondaryAssetID)
                    .Distinct()
                    .ToList();

                var secondaryAssets = await db.Assets
                    .AsNoTracking()
                    .Where(a => secondaryAssetIds.Contains(a.ID) && !a.IsDeleted)
                    .ToDictionaryAsync(a => a.ID);

                var secondaryAssetAttributes = await db.AssetAttributes
                    .AsNoTracking()
                    .Where(x => secondaryAssetIds.Contains(x.AssetID) && !x.IsDeleted)
                    .ToListAsync();

                foreach (var assetLink in assetLinks)
                {
                    if (secondaryAssets.TryGetValue(assetLink.SecondaryAssetID, out var secondaryAsset))
                    {
                        var assetLinkDto = mapper.Map<AssetLinkDto>(assetLink);

                        var secondaryAssetDto = mapper.Map<AssetDto>(secondaryAsset);

                        secondaryAssetDto.Attributes = secondaryAssetAttributes
                            .Where(x => x.AssetID == secondaryAsset.ID)
                            .Select(x =>
                            {
                                var attrDto = mapper.Map<AssetAttributeDto>(x);
                                attrDto.Asset = null;
                                return attrDto;
                            })
                            .ToList();

                        // Prevent circular dependencies
                        secondaryAssetDto.PrimaryAssets = new List<AssetLinkDto>();
                        secondaryAssetDto.SecondaryAssets = new List<AssetLinkDto>();
                        secondaryAssetDto.Attachments = new List<AssetAttachmentDto>();
                        secondaryAssetDto.Vendors = new List<AssetVendorDto>();
                        secondaryAssetDto.Schedules = new List<AssetScheduleDto>();

                        assetLinkDto.SecondaryAsset = secondaryAssetDto;

                        result.SecondaryAssets.Add(assetLinkDto);
                    }
                }
            }

            // 10. Get TypeValue
            var flagValues = await db.TypeMasters
                .AsNoTracking()
                .Where(x => x.Entity.ToLower() == nameof(Asset).ToLower())
                .ToListAsync();

            result.TypeValue = flagValues
                .FirstOrDefault(x => x.Value == result.TypeFlag)?.Title ?? "";

            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while updating asset {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = ex.Message });
        }
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = mapper.Map<AssetDto>(await service.GetById(id));
            if (result == null)
                return BadRequest("Not Modified");

            await service.Delete(id);
            logger.LogInformation("Asset {Id} deleted successfully", id);

            return Ok();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while deleting asset {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Get(string? Filters = null, string? Search = null, string? Sort = null)
    {
        try
        {
            // 1. Get main assets WITHOUT any navigation properties
            var query = service.Get(
                Filters != null ? DataTools.GetObjectFromJsonString<APIFilter>(Filters).Filters : null,
                Search,
                Sort);

            var entities = await query.AsNoTracking().ToListAsync();

            if (!entities.Any())
            {
                return Ok(new List<AssetDto>());
            }

            var assetIds = entities.Select(x => x.ID).ToList();

            // 2. Map to DTOs (base properties only)
            var results = mapper.Map<List<AssetDto>>(entities);

            // 3. Get Attachments for all assets
            var allAttachments = await db.AssetAttachments
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            // 4. Get Attributes for all assets
            var allAttributes = await db.AssetAttributes
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            // 5. Get Vendors for all assets
            var allVendors = await db.AssetVendors
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            // 6. Get Vendor Contacts if needed
            var contactIds = allVendors
                .Where(v => v.ContactID.HasValue)
                .Select(v => v.ContactID.Value)
                .Distinct()
                .ToList();

            var contacts = new Dictionary<int, ContactDto>();
            if (contactIds.Any())
            {
                var contactEntities = await contactService.Get()
                    .AsNoTracking()
                    .Where(x => contactIds.Contains(x.ID))
                    .ToListAsync();

                foreach (var contact in contactEntities)
                {
                    contacts[contact.ID] = mapper.Map<ContactDto>(contact);
                }
            }

            // 7. Get Schedules WITHOUT Include - just like GetById
            var allSchedules = await db.AssetSchedules
                .AsNoTracking()
                .Where(x => assetIds.Contains(x.AssetID) && !x.IsDeleted)
                .ToListAsync();

            var scheduleIds = allSchedules.Select(s => s.ID).ToList();

            var scheduleContacts = new Dictionary<int, ContactDto>();
            var scheduleAttachments = new List<AssetScheduleAttachment>();
            var scheduleComponents = new List<AssetScheduleComponent>();

            if (scheduleIds.Any())
            {
                // Load schedule contacts separately
                var scheduleContactIds = allSchedules
                    .Where(s => s.ContactID.HasValue)
                    .Select(s => s.ContactID.Value)
                    .Distinct()
                    .ToList();

                if (scheduleContactIds.Any())
                {
                    var scheduleContactEntities = await contactService.Get()
                        .AsNoTracking()
                        .Where(x => scheduleContactIds.Contains(x.ID))
                        .ToListAsync();

                    foreach (var contact in scheduleContactEntities)
                    {
                        scheduleContacts[contact.ID] = mapper.Map<ContactDto>(contact);
                    }
                }

                // Load schedule attachments separately
                scheduleAttachments = await db.AssetScheduleAttachments
                    .AsNoTracking()
                    .Where(x => scheduleIds.Contains(x.AssetScheduleID) && !x.IsDeleted)
                    .ToListAsync();

                // Load schedule components separately
                scheduleComponents = await db.AssetScheduleComponents
                    .AsNoTracking()
                    .Where(x => scheduleIds.Contains(x.ScheduleID) && !x.IsDeleted)
                    .ToListAsync();
            }

            // 8. Get Asset Links where assets are PRIMARY
            var allPrimaryLinks = await db.AssetLinks
                .AsNoTracking()
                .Where(al => assetIds.Contains(al.PrimaryAssetID) && !al.IsDeleted)
                .ToListAsync();

            // 9. Get linked assets (secondary assets)
            var linkedAssetIds = allPrimaryLinks.Select(x => x.SecondaryAssetID).Distinct().ToList();

            var linkedAssets = new Dictionary<int, Asset>();
            var linkedAssetAttributes = new List<AssetAttribute>();

            if (linkedAssetIds.Any())
            {
                linkedAssets = await db.Assets
                    .AsNoTracking()
                    .Where(a => linkedAssetIds.Contains(a.ID) && !a.IsDeleted)
                    .ToDictionaryAsync(a => a.ID);

                linkedAssetAttributes = await db.AssetAttributes
                    .AsNoTracking()
                    .Where(x => linkedAssetIds.Contains(x.AssetID) && !x.IsDeleted)
                    .ToListAsync();
            }

            // 10. Get TypeValues
            var flagValues = await db.TypeMasters
                .AsNoTracking()
                .Where(x => x.Entity.ToLower() == nameof(Asset).ToLower())
                .ToListAsync();

            // 11. Populate each result - following GetById pattern
            foreach (var result in results)
            {
                // Set TypeValue
                result.TypeValue = flagValues
                    .FirstOrDefault(x => x.Value == result.TypeFlag)?.Title ?? "";

                // Set Attachments
                result.Attachments = allAttachments
                    .Where(x => x.AssetID == result.ID)
                    .Select(x => mapper.Map<AssetAttachmentDto>(x))
                    .ToList();

                // Set Attributes - CRITICAL: Set Asset to null
                result.Attributes = allAttributes
                    .Where(x => x.AssetID == result.ID)
                    .Select(x =>
                    {
                        var dto = mapper.Map<AssetAttributeDto>(x);
                        dto.Asset = null; // Break circular reference
                        return dto;
                    })
                    .ToList();

                // Set Vendors
                result.Vendors = allVendors
                    .Where(x => x.AssetID == result.ID)
                    .Select(v =>
                    {
                        var dto = mapper.Map<AssetVendorDto>(v);
                        return dto;
                    })
                    .ToList();

                // Assign vendor contacts
                foreach (var vendor in result.Vendors)
                {
                    if (vendor.ContactID.HasValue && contacts.ContainsKey(vendor.ContactID.Value))
                    {
                        vendor.Contact = contacts[vendor.ContactID.Value];
                    }
                }

                // Set Schedules
                result.Schedules = allSchedules
                    .Where(x => x.AssetID == result.ID)
                    .Select(s =>
                    {
                        var dto = mapper.Map<AssetScheduleDto>(s);
                        return dto;
                    })
                    .ToList();

                // Assign schedule details
                foreach (var schedule in result.Schedules)
                {
                    // Set schedule contact
                    if (schedule.ContactID.HasValue && scheduleContacts.ContainsKey(schedule.ContactID.Value))
                    {
                        schedule.Contact = scheduleContacts[schedule.ContactID.Value];
                    }

                    // Set schedule attachments
                    schedule.Attachments = scheduleAttachments
                        .Where(x => x.AssetScheduleID == schedule.ID)
                        .Select(x => mapper.Map<AssetScheduleAttachmentDto>(x))
                        .ToList();

                    // Set schedule components
                    schedule.Components = scheduleComponents
                        .Where(x => x.ScheduleID == schedule.ID)
                        .Select(x => mapper.Map<AssetScheduleComponentDto>(x))
                        .ToList();
                }

                // Initialize arrays - following GetById pattern
                result.PrimaryAssets = new List<AssetLinkDto>();
                result.SecondaryAssets = new List<AssetLinkDto>();

                // Get AssetLinks where current asset is PRIMARY
                var assetLinks = allPrimaryLinks.Where(al => al.PrimaryAssetID == result.ID).ToList();

                if (assetLinks.Any())
                {
                    // Get IDs of all secondary (linked) assets
                    var secondaryAssetIds = assetLinks.Select(x => x.SecondaryAssetID).Distinct().ToList();

                    // Build the SecondaryAssets array
                    foreach (var assetLink in assetLinks)
                    {
                        if (linkedAssets.TryGetValue(assetLink.SecondaryAssetID, out var secondaryAsset))
                        {
                            // Create AssetLinkDto
                            var assetLinkDto = mapper.Map<AssetLinkDto>(assetLink);

                            // Create full AssetDto for the secondary asset
                            var secondaryAssetDto = mapper.Map<AssetDto>(secondaryAsset);

                            // Add attributes to secondary asset
                            secondaryAssetDto.Attributes = linkedAssetAttributes
                                .Where(x => x.AssetID == secondaryAsset.ID)
                                .Select(x =>
                                {
                                    var attrDto = mapper.Map<AssetAttributeDto>(x);
                                    attrDto.Asset = null; // Break circular reference
                                    return attrDto;
                                })
                                .ToList();

                            // Prevent circular dependencies
                            secondaryAssetDto.PrimaryAssets = new List<AssetLinkDto>();
                            secondaryAssetDto.SecondaryAssets = new List<AssetLinkDto>();
                            secondaryAssetDto.Attachments = new List<AssetAttachmentDto>();
                            secondaryAssetDto.Vendors = new List<AssetVendorDto>();
                            secondaryAssetDto.Schedules = new List<AssetScheduleDto>();

                            // Attach secondary asset to the link
                            assetLinkDto.SecondaryAsset = secondaryAssetDto;

                            // Add to result.SecondaryAssets (NOT PrimaryAssets!)
                            result.SecondaryAssets.Add(assetLinkDto);
                        }
                    }
                }
            }

            return Ok(results);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching assets");
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while fetching assets.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("SearchTagOptions")]
    public async Task<IActionResult> GetSearchTagOptions()
    {
        try
        {
            return Ok(await service.GetSearchTagOptions());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching search tag options");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("FieldOptions")]
    public async Task<IActionResult> GetFieldOptions(string field)
    {
        try
        {
            return Ok(await service.GetFieldOptions(field));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching field options for {Field}", field);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("NextCode/{typeFlag:int}")]
    public async Task<IActionResult> GetNextCode(int typeFlag)
    {
        try
        {
            var result = await service.GetNextCode(DateTime.UtcNow, typeFlag);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while getting next code for type {TypeFlag}", typeFlag);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                Message = "An unexpected error occurred while getting next code.",
                Details = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("AttributeOptions/{property}")]
    public async Task<IActionResult> GetAttributeOptions(string property)
    {
        try
        {
            return Ok(await service.GetAttibuteValueOptions(property));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while fetching attribute options for {Property}", property);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { Message = ex.Message });
        }
    }

   
}