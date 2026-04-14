using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MyCockpitView.Utility.Common;

public static class DateTimeExtensions
{
    public static DateTime ToISTFormat(this DateTime dateTime)
    {
        //if (!dateTime.HasValue) return null;

        if (dateTime.Kind == DateTimeKind.Utc)
        {
            // If the input DateTime is in UTC, convert it to IST
            return TimeZoneInfo.ConvertTimeFromUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }
        else
        {
            // If the input DateTime has an unspecified Kind, assume it is in UTC and convert it to IST
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(dateTime, DateTimeKind.Utc), TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }
    }

    public static DateTime ToUTCFormat(this DateTime dateTime)
    {

        if (dateTime.Kind == DateTimeKind.Utc)
        {
            // If the input DateTime is in UTC, convert it to IST
            return TimeZoneInfo.ConvertTimeToUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }
        else
        {
            // If the input DateTime has an unspecified Kind, assume it is in UTC and convert it to IST
            return TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(dateTime, DateTimeKind.Utc), TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }
    }
}