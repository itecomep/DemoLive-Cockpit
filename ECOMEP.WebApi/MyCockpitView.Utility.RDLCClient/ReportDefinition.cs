using System.Data;
using System.Xml;

namespace MyCockpitView.Utility.RDLCClient;

public class ReportDefinition
{
    public ReportDefinition()
    {
        SubReports = new HashSet<ReportDefinition>();
        ReportDataSet = new DataTable();
        ReportProperties = new List<ReportProperties>();
        FileContent = Array.Empty<byte>();
    }
    public string? ReportPath { get; set; }
    public DataTable ReportDataSet { get; set; }
    public IEnumerable<ReportProperties> ReportProperties { get; set; }
    public string? RenderType { get; set; } = "PDF";
    public string? ReportName { get; set; }
    public ICollection<ReportDefinition> SubReports { get; set; }
    public string? Filename { get; set; }
    public bool EmbedFonts { get; set; }
    public string? FileContentType
    {
        get
        {
            switch (RenderType)
            {
                case "EXCELOPENXML":
                    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                default:
                    return "application/pdf";
            }
        }
    }

    public byte[] FileContent { get; set; }

    public string? FileExtension
    {
        get
        {
            switch (RenderType)
            {
                case "EXCELOPENXML":
                    return ".xlsx";
                default:
                    return ".pdf";
            }
        }
    }

   
}

public class ReportProperties
{
    public string? PropertyName { get; set; }

    public string? PropertyValue { get; set; }
}
