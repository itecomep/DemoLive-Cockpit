using System.Data;
using System.Reflection;
using System.Text.Json;
using ClosedXML.Excel;

namespace MyCockpitView.Utility.Excel;

public static class ExcelUtility
{
    public static DataTable ToDataTable<T>(IEnumerable<T> items)
    {
        DataTable dataTable = new DataTable(typeof(T).Name);
        //Get all the properties by using reflection
        PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (PropertyInfo prop in Props)
        {
            //Setting column names as Property names
            dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
        }
        foreach (T item in items)
        {
            var values = new object[Props.Length];
            for (int i = 0; i < Props.Length; i++)
            {
                values[i] = Props[i].GetValue(item, null) ?? string.Empty;
            }
            dataTable.Rows.Add(values);
        }

        return dataTable;
    }
    public static byte[] ExportExcel(DataSet DataSet, string[]? Sheets = null)
    {

        MemoryStream memoryStream = new MemoryStream();

        XLWorkbook wbook = new XLWorkbook();
        for (var i = 0; i < DataSet.Tables.Count; i++)
        {
            var _sheetName = "Sheet" + (i + 1).ToString("00");
            if (Sheets != null && Sheets.Any())
                _sheetName = Sheets[i];

            var ws = wbook.Worksheets.Add(DataSet.Tables[i], _sheetName);
            var table = ws.Tables.FirstOrDefault();
            if (table != null)
                table.Theme = XLTableTheme.None;

            // Auto-fit columns
            ws.Columns().AdjustToContents();


            // Check if the "Url" column exists and apply hyperlink formatting
            var dataTable = DataSet.Tables[i];
            if (dataTable.Columns.Contains("Url"))
            {
                var urlColumn = dataTable.Columns["Url"];
                if (urlColumn != null)
                {
                    int urlColumnIndex = urlColumn.Ordinal + 1; // Excel columns are 1-based
                    for (int row = 2; row <= dataTable.Rows.Count + 1; row++) // Assuming row 1 is header
                    {
                        var cell = ws.Cell(row, urlColumnIndex);
                        string urlValue = cell.Value.ToString();
                        if (!string.IsNullOrEmpty(urlValue))
                        {
                            cell.SetHyperlink(new XLHyperlink(urlValue));
                            cell.Style.Font.Underline = XLFontUnderlineValues.Single;
                            cell.Style.Font.FontColor = XLColor.Blue;
                        }
                    }
                }
            }
        }

        wbook.SaveAs(memoryStream);
        memoryStream.Close();
        return memoryStream.ToArray();

    }

    public static byte[] ExportExcel<T>(this IEnumerable<T> items)
    {
        var datatable = ToDataTable<T>(items);
        var dataSet = new DataSet();
        dataSet.Tables.Add(datatable);
        return ExportExcel(dataSet);
    }


    public static byte[] ExportExcel(JsonElement data)
    {
        if (data.ValueKind == JsonValueKind.Null)
        {
            throw new Exception("Invalid data. JSON is null. Excel cannot be generated.");
        }

        if (data.ValueKind != JsonValueKind.Array)
        {
            throw new Exception("Invalid data. JSON array is expected.  Excel cannot be generated.");
        }
        var propertyNames = new List<string>();
        var wbook = new XLWorkbook();
        var ws = wbook.Worksheets.Add("Sheet1");

        // Extract and populate data
        int row = 1;
        foreach (var item in data.EnumerateArray())
        {
            if (item.ValueKind == JsonValueKind.Object)
            {
                var rowValues = new List<string>();

                foreach (var property in item.EnumerateObject())
                {
                    string propertyName = property.Name;
                    if (!propertyNames.Contains(propertyName))
                    {
                        propertyNames.Add(propertyName);
                        ws.Cell(1, propertyNames.Count).Value = propertyName;
                    }
                    rowValues.Add(property.Value.ToString());
                }

                for (int col = 0; col < rowValues.Count; col++)
                {
                    ws.Cell(row + 1, col + 1).Value = rowValues[col];
                }

                row++;
            }
        }

        MemoryStream memoryStream = new MemoryStream();
        wbook.SaveAs(memoryStream);
        memoryStream.Close();
        return memoryStream.ToArray();

    }
}
