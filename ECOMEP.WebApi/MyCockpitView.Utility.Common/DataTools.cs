using System.Data;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace MyCockpitView.Utility.Common;
public static class DataTools
{
    public static Type GetPropertyType(this object Entity, string Property)
    {
        PropertyInfo _prop = Entity.GetType().GetProperty(Property);
        return _prop.PropertyType;
    }
    public static object GetPropertyValue(this object Entity, string Property)
    {
        PropertyInfo _prop = Entity.GetType().GetProperty(Property);
        return _prop.GetValue(Entity, null);
    }

    public static string GetFileExtension(string Filename)
    {
        return Filename.Substring(Filename.LastIndexOf('.'));
    }
    //public static string GetContentType(string filename)
    //{
    //    var contentTypeProvider = new FileExtensionContentTypeProvider();
    //    string contentType;
    //    if (!contentTypeProvider.TryGetContentType(filename, out contentType))
    //    {
    //        contentType = "application/octet-stream";
    //    }

    //    return contentType;
    //}

    public static string FormatSize(int size)
    {
            decimal s = size;
            string[] format = new string[] { "{0} bytes", "{0} KB", "{0} MB", "{0} GB", "{0} TB", "{0} PB", "{0} EB" };
            int i = 0;
            while (i < format.Length && s >= 1024)
            {
                s = s / 1024.0m;
                i++;
            }
            return string.Format(format[i], Math.Round(s, 2));

    }

    public static string GetSize(long size)
    {
        decimal s = size;
        string[] format = new string[] { "{0} bytes", "{0} KB", "{0} MB", "{0} GB", "{0} TB", "{0} PB", "{0} EB" };
        int i = 0;
        while (i < format.Length && s >= 1024)
        {
            s = s / 1024.0m;
            i++;
        }
        return string.Format(format[i], Math.Round(s, 1));
    }
   
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
                values[i] = Props[i].GetValue(item, null);
            }
            dataTable.Rows.Add(values);
        }

        return dataTable;
    }

    public static char GetAplahbet(int value)
    {
        if (value > 0 && value <= 26)
        {
            string alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            return alpha[Convert.ToInt32(value)];
        }

        return 'A';
    }
    /// <summary>
    /// return 'A-Z....AA,AB-AZ...BA....
    /// </summary>
    /// <param name="order"></param>
    /// <returns></returns>
    public static string GetAlphaCode(int order)
    {
        int _index = order;
        string _code = String.Empty;
        int mod;

        while (_index > 0)
        {

            mod = (_index - 1) % 26;
            _code = Convert.ToChar(65 + mod).ToString() + _code;
            _index = (int)((_index - mod) / 26);
        }
        return _code;
    }
    private static string GenerateSequence(int num)
    {
        string str = "";
        char achar;
        int mod;
        while (true)
        {
            mod = num % 26 + 65;
            num = num / 26;
            achar = (char)mod;
            str = achar + str;
            if (num > 0) num--;
            else if (num == 0) break;
        }
        return str;
    }
    public static string GetAbbreviation(string text, int MinChar, int MaxChar)
    {
        string[] words = text.Trim().Split(' ');
        string abbreviation = "";

        // If there are multiple words, generate abbreviation from uppercase letters
        if (words.Length > 1)
        {
            foreach (string word in words)
            {
                if (!string.IsNullOrWhiteSpace(word) && Char.IsUpper(word[0]))
                {
                    abbreviation += word[0];
                }
            }
        }

        // If no uppercase letters found or single word, use the first MinChar characters of the text
        if (string.IsNullOrEmpty(abbreviation))
        {
            abbreviation = text.Substring(0, Math.Min(text.Length, MaxChar));
        }

        // Ensure the abbreviation has at least MinChar characters by adding more from the word if needed
        if (abbreviation.Length < MinChar)
        {
            int additionalChars = MinChar - abbreviation.Length;
            if (words.Length == 1) // Single word case
            {
                abbreviation += text.Substring(abbreviation.Length, Math.Min(additionalChars, text.Length - abbreviation.Length));
            }
            else // Multiple word case
            {
                foreach (string word in words)
                {
                    if (!abbreviation.Contains(word[0]) && abbreviation.Length < MinChar)
                    {
                        abbreviation += word.Substring(0, Math.Min(word.Length, additionalChars));
                    }
                }
            }
        }

        return abbreviation.Substring(0, Math.Min(MaxChar, abbreviation.Length));
    }

    public static T GetObjectFromJsonString<T>(string Jsonstring)
    {
        return JsonSerializer.Deserialize<T>(Jsonstring, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            //WriteIndented = true,
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
        });
    }

    public static string GetJsonStringFromObject(object ObjectValue)
    {
        return JsonSerializer.Serialize(ObjectValue, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            //WriteIndented = true,
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
        });
    }

    public static bool IsEmailValid(string Email)
    {
        Regex regex = new Regex(@"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$");

        Match match = regex.Match(Email);
        return match.Success;
    }


    public static string CurrencyFormat(decimal value)
    {
        CultureInfo ci = new CultureInfo("en-IN", false);
        decimal parsed = decimal.Parse(value.ToString(), CultureInfo.InvariantCulture);
        return string.Format(ci, "{0:c}", value);
    }
    public static string Conversion(decimal amount)
    {


        decimal m = amount;
        int whole = (int)m;
        decimal precision = (m - whole) * 100;
        //int l = amount;

        //int j = (l - m) * 100;

        string beforefloating = ConvertNumbertoWords(Convert.ToInt32(whole));
        string afterfloating = ConvertNumbertoWords(Convert.ToInt32(precision));

        var Content = beforefloating + ' ' + "RUPEES AND" + ' ' + afterfloating + ' ' + "PAISE only";

        TextInfo textInfo = new CultureInfo("en-IN", false).TextInfo;
        var _words = textInfo.ToTitleCase(Content.ToLower());

        return _words;


    }

    public static string ConvertNumbertoWords(int number)
    {

        if (number == 0) return "ZERO";
        if (number < 0) return "minus " + ConvertNumbertoWords(Math.Abs(number));

        StringBuilder words = new StringBuilder();

        if (number / 100000 > 0)
        {
            words.AppendLine(ConvertNumbertoWords(number / 100000) + " LAKHS ");
            number %= 100000;
        }
        if (number / 1000 > 0)
        {
            words.AppendLine(ConvertNumbertoWords(number / 1000) + " THOUSAND ");
            number %= 1000;
        }
        if (number / 100 > 0)
        {
            words.AppendLine(ConvertNumbertoWords(number / 100) + " HUNDRED ");
            number %= 100;
        }
        //if ((number / 10) > 0)  
        //{  
        // words += ConvertNumbertoWords(number / 10) + " RUPEES ";  
        // number %= 10;  
        //}  
        if (number > 0)
        {
            if (Convert.ToString(words) != "") words.AppendLine("AND ");
            var unitsMap = new[]
            {
            "ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
                };
            var tensMap = new[]
            {
            "ZERO", "TEN", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
                };
            if (number < 20)
            {
                words.AppendLine(unitsMap[number]);
            }
            else
            {
                words.AppendLine(tensMap[number / 10]);
                if (number % 10 > 0) words.AppendLine(" " + unitsMap[number % 10]);
            }
        }

        string _words = words.ToString();
        _words = _words.Replace("\r\n", "");

        return _words;


    }
}
