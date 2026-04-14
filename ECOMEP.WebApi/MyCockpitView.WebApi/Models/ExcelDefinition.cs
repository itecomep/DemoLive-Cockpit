using MyCockpitView.Utility.Excel;
using MyCockpitView.Utility.Common;
using System.Text.Json;

namespace MyCockpitView.WebApi.Models;

public class ExcelDefinition
{
    public string? Filename { get; set; }

    public JsonElement DataList { get; set; }

    public byte[] GetExcel()
    {
        return ExcelUtility.ExportExcel(DataList);
    }
}
