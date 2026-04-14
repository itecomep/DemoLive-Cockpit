
using System.Globalization;
using System.Text;

namespace MyCockpitView.Utility.Common;

public static class CurrencyExtensions
{
    public static string FormatAsCurrency(this decimal number)
    {
        CultureInfo inr = new CultureInfo("en-IN");
        return number.ToString("#,#.##", inr);
    }

    public static string ToWords(this decimal amount)
    {


        decimal m = amount;
        long whole = (long)m;
        decimal precision = (m - whole) * 100;
        //int l = amount;

        //int j = (l - m) * 100;

        string beforefloating = ConvertNumbertoWords(Convert.ToInt64(whole));
        string afterfloating = ConvertNumbertoWords(Convert.ToInt64(precision));

        var Content = beforefloating + ' ' + "RUPEES AND" + ' ' + afterfloating + ' ' + "PAISE only";

        TextInfo textInfo = new CultureInfo("en-IN", false).TextInfo;
        var _words = textInfo.ToTitleCase(Content.ToLower());

        return _words;


    }

    public static string ConvertNumbertoWords(long number)
    {
        if (number == 0) return "ZERO";
        if (number < 0) return "minus " + ConvertNumbertoWords(Math.Abs(number));

        StringBuilder words = new StringBuilder();
        if ((number / 10000000) > 0)
        {
            words.AppendLine(ConvertNumbertoWords(number / 10000000) + " CRORES ");
            number %= 10000000;
        }
        if ((number / 100000) > 0)
        {
            words.AppendLine(ConvertNumbertoWords(number / 100000) + " LAKHS ");
            number %= 100000;
        }
        if ((number / 1000) > 0)
        {
            words.AppendLine(ConvertNumbertoWords(number / 1000) + " THOUSAND ");
            number %= 1000;
        }
        if ((number / 100) > 0)
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
                if ((number % 10) > 0) words.AppendLine(" " + unitsMap[number % 10]);
            }
        }

        string _words = words.ToString();
        _words = _words.Replace("\r\n", "");

        return _words;

    }
}
