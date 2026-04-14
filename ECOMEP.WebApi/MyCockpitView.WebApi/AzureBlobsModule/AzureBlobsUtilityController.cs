using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyCockpitView.WebApi;
using MyCockpitView.WebApi.AppSettingMasterModule;
using MyCockpitView.WebApi.AzureBlobsModule;

namespace IDAC.DotNet.Api.AzureBlobsModule
{
    [Route("[controller]")]
    [ApiController]
    public class AzureBlobsUtilityController : ControllerBase
    {
        ILogger<AzureBlobsUtilityController> logger;
        private readonly IAzureBlobService azureBlobService;
        private readonly IAppSettingMasterService appSettingMasterService;
        public AzureBlobsUtilityController(
            ILogger<AzureBlobsUtilityController> logger,
            IAzureBlobService azureBlobService,
            IAppSettingMasterService appSettingMasterService)
        {
            this.logger = logger;
            this.azureBlobService = azureBlobService;
            this.appSettingMasterService = appSettingMasterService;
        }

        [Authorize]
        [HttpGet("SAS")]
        public async Task<IActionResult> GetSAS(string Container)
        {
            var _key = await appSettingMasterService.GetPresetValue(McvConstant.AZURE_STORAGE_KEY);
            var _account = await appSettingMasterService.GetPresetValue(McvConstant.AZURE_STORAGE_ACCOUNT);
            var token= new AzureBlobStorageSASTokenResult { Account = _account, SASToken = await azureBlobService.GetSAS(_key, Container) };

            return Ok(token);

        }
    }
}
