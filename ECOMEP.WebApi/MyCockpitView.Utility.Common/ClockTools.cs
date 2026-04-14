
using System.Globalization;

namespace MyCockpitView.Utility.Common;
public static class ClockTools
{
    public static DateTime GetFinancialYearStart(DateTime dateTime)
    {
        int year = dateTime.Month >= 4 ? dateTime.Year : dateTime.Year - 1;
        DateTime financialYearStart = new DateTime(year, 4, 1); // assuming financial year starts on April 1st

        return financialYearStart;
    }

    /// <summary>
    /// Input string must be in 00:00:00 format
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    public static int ConvertTimestringToMinutes(string input)
    {
        DateTime time = DateTime.Parse(input);
        return (int)(time - time.Date).TotalMinutes;
    }
    public static string GetFinancialYear(DateTime dateTime)
    {
        return dateTime.Month < 4 ? dateTime.AddYears(-1).ToString("yyyy") + "-" + dateTime.ToString("yyyy") : dateTime.ToString("yyyy") + "-" + dateTime.AddYears(1).ToString("yyyy");
    }

    public static string GetFinancialYearShort(DateTime dateTime)
    {
        return dateTime.Month < 4 ? dateTime.AddYears(-1).ToString("yy") + "-" + dateTime.ToString("yy") : dateTime.ToString("yy") + "-" + dateTime.AddYears(1).ToString("yy");
    }
    public static string GetFinancialYearMid(DateTime dateTime)
    {
        return dateTime.Month < 4 ? dateTime.AddYears(-1).ToString("yyyy") + "-" + dateTime.ToString("yy") : dateTime.ToString("yyyy") + "-" + dateTime.AddYears(1).ToString("yy");
    }
    public static int GetLastQuarterDay(DateTime dateTime, int offset = 0)
    {
        var LastDay = DateTime.DaysInMonth(DateTime.UtcNow.Year, DateTime.UtcNow.Month);

        if (offset > 0)
            LastDay = LastDay - offset;

        if (new DateTime(dateTime.Year, dateTime.Month, LastDay).DayOfWeek == DayOfWeek.Sunday)
            LastDay--;

        return LastDay;
    }

    public static int GetFinancialQuarter(DateTime dateTime)
    {
        if (dateTime.Month < 4)
        {
            return 4;
        }
        else if (dateTime.Month >= 4 && dateTime.Month < 7)
        {
            return 1;
        }
        else if (dateTime.Month >= 7 && dateTime.Month < 10)
        {
            return 2;
        }
        else //>=10
        {
            return 3;
        }
    }

    public static bool IsQuarterEnd(DateTime dateTime)
    {
        if (dateTime.Month % 3 == 0)
            return true;

        return false;
    }

    public static string GetMonthName(int month, string format = "MMMM")
    {
        return new DateTime(DateTime.UtcNow.Year, month, 1).ToString(format, CultureInfo.InvariantCulture);
    }





    public static TimeSpan GetDifference(DateTime start, DateTime stop)
    {
        TimeSpan span = stop > start ? stop - start : new TimeSpan(0, 0, 0);
        //string.Format("{0} days, {1} hours, {2} minutes, {3} seconds",
        //    span.Days, span.Hours, span.Minutes, span.Seconds);
        return span;
    }

    public static int GetDaysDifference(DateTime start, DateTime stop)
    {
        TimeSpan span = stop > start ? stop - start : new TimeSpan(0, 0, 0);
        //string.Format("{0} days, {1} hours, {2} minutes, {3} seconds",
        //    span.Days, span.Hours, span.Minutes, span.Seconds);
        return span.Days;
    }

    public static double GetHourDifference(DateTime start, DateTime stop)
    {
        TimeSpan span = stop > start ? stop - start : new TimeSpan(0, 0, 0);
        return span.TotalHours;
    }

    public static int GetMinutesDifference(DateTime start, DateTime stop)
    {
        TimeSpan span = stop > start ? stop - start : new TimeSpan(0, 0, 0);
        return span.Minutes;
    }

    public static DateTime GetISTNow()
    {
        return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
            TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
    }

    public static DateTime GetIST(DateTime date)
    {
        if (date.Kind == DateTimeKind.Utc)
        {
            // If the input DateTime is in UTC, convert it to IST
            return TimeZoneInfo.ConvertTimeFromUtc(date, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }
        else
        {
            // If the input DateTime has an unspecified Kind, assume it is in UTC and convert it to IST
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.SpecifyKind(date, DateTimeKind.Utc), TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }

    }


    public static DateTime GetUTC(DateTime date)
    {
        try
        {
            return TimeZoneInfo.ConvertTimeToUtc(date,
        TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }
        catch (Exception)
        {
            return date.AddMinutes(-330);
        }
    }


    public static int GetValidWorkingDays(DateTime start, DateTime end, bool inclSunday, bool inclSaturday, IEnumerable<DateTime> Holidays, bool EvenSaturdaysOff = false, bool OddSaturdaysOff = false)
    {
        var _start = GetNextValidWorkingDate(start, EvenSaturdaysOff, OddSaturdaysOff, Holidays);
        var _end = GetPreviousValidWorkingDate(end, EvenSaturdaysOff, OddSaturdaysOff, Holidays);

        int days = 0;
        while (_start <= _end)
        {
            if (_start.DayOfWeek == DayOfWeek.Saturday && inclSaturday)
            {
                days++;
            }
            else if (_start.DayOfWeek == DayOfWeek.Sunday && inclSunday)
            {
                days++;
            }
            else
            {
                days++;
            }
            _start = _start.AddDays(1);
        }
        return days;
    }

    public static DateTime GetNextValidWorkingDate(DateTime Date, bool EvenSaturdaysOff = false, bool OddSaturdaysOff = false, IEnumerable<DateTime> Holidays = null)
    {
        var _next = Date;

        if (Holidays != null)
        {
            while (Holidays.Any(x => x == _next))
            {
                _next = _next.AddDays(1);

                _next = GetNextIfSunday(_next);

                _next = GetNextIfSatruday(_next, EvenSaturdaysOff, OddSaturdaysOff);
            }
        }
        else
        {
            _next = GetNextIfSunday(_next);

            _next = GetNextIfSatruday(_next, EvenSaturdaysOff, OddSaturdaysOff);
        }

        return _next;
    }

    public static DateTime GetPreviousValidWorkingDate(DateTime Date, bool EvenSaturdaysOff = false, bool OddSaturdaysOff = false, IEnumerable<DateTime> Holidays = null)
    {
        var _prev = Date;
        if (Holidays != null)
        {
            while (Holidays.Any(x => x == _prev))
            {
                _prev.AddDays(-1);

                _prev = GetPreviousIfSunday(_prev);

                _prev = GetPreviousIfSaturday(_prev, EvenSaturdaysOff, OddSaturdaysOff);
            }
        }
        else
        {
            _prev = GetPreviousIfSunday(_prev);

            _prev = GetPreviousIfSaturday(_prev, EvenSaturdaysOff, OddSaturdaysOff);
        }

        return _prev;
    }

    public static DateTime GetNextIfSunday(DateTime Date)
    {

        return Date.DayOfWeek == DayOfWeek.Sunday ? Date.AddDays(1) : Date;

    }

    public static DateTime GetPreviousIfSunday(DateTime Date)
    {

        return Date.DayOfWeek == DayOfWeek.Sunday ? Date.AddDays(-1) : Date;

    }

    public static DateTime GetNextIfSatruday(DateTime Date, bool EvenSaturdaysOff = false, bool OddSaturdaysOff = false)
    {
        if (Date.DayOfWeek != DayOfWeek.Saturday) return Date;

        var _first = Convert.ToInt32(new DateTime(Date.Year, Date.Month, 1).DayOfWeek);

        if (EvenSaturdaysOff)
        {
            if (Date.Day == 14 - _first || Date.Day == 28 - _first)
            {
                return Date.AddDays(2);
            }
        }
        else if (OddSaturdaysOff)
        {
            if (Date.Day != 14 - _first && Date.Day != 28 - _first)
            {
                return Date.AddDays(2);
            }
        }

        return Date;
    }

    public static DateTime GetPreviousIfSaturday(DateTime Date, bool EvenSaturdaysOff = false, bool OddSaturdaysOff = false)
    {

        if (Date.DayOfWeek != DayOfWeek.Saturday) return Date;

        var _first = Convert.ToInt32(new DateTime(Date.Year, Date.Month, 1).DayOfWeek);

        if (EvenSaturdaysOff)
        {
            if (Date.Day == 14 - _first || Date.Day == 28 - _first)
            {
                return Date.AddDays(-1);
            }
        }
        else if (OddSaturdaysOff)
        {
            if (Date.Day != 14 - _first && Date.Day != 28 - _first)
            {
                return Date.AddDays(-1);
            }
        }

        return Date;

    }

    public static TimeSpan RoundToNearestMinutes(TimeSpan input, int minutes)
    {
        var totalMinutes = (int)(input + new TimeSpan(0, minutes / 2, 0)).TotalMinutes;

        return new TimeSpan(0, totalMinutes - totalMinutes % minutes, 0);
    }

    public static DateTime RoundToNearestMinutes(DateTime input, int minutes, bool Ceiling = false)
    {
        var totalMinutes = (int)(input.TimeOfDay + new TimeSpan(0, minutes / 2, 0)).TotalMinutes;
        var _next = totalMinutes - totalMinutes % minutes;

        if (Ceiling)
        {
            if (_next >= input.TimeOfDay.TotalMinutes)
                return input.Date.AddMinutes(_next);
            else
                return input.Date.AddMinutes(_next + minutes);
        }
        else
        {
            return input.Date.AddMinutes(_next);
        }
    }


    public static int GetBussinessBlocks(DateTime Start, DateTime End, IEnumerable<DateTime> Holidays, int StartMinutes = 0, int EndMinutes = 0, bool IncludeSaturdays = false, bool IncludeSundays = false)
    {
       
            var _blocks = 0;
            int _blocksPerDay = Convert.ToInt32(Math.Round((EndMinutes - StartMinutes) / 30.0, 0));

            if (Start.Date < End.Date)
            {
                var _start = GetIST(Start).Date;
                var _end = GetIST(End).Date;
                var days = 0;
                while (_start <= _end)
                {
                    if (_start.DayOfWeek == DayOfWeek.Saturday)
                    {
                        if (IncludeSaturdays)
                            ++days;
                    }
                    else if (_start.DayOfWeek == DayOfWeek.Sunday)
                    {
                        if (IncludeSundays)
                            ++days;
                    }
                    else
                    {

                        if (!Holidays.Any(x => x == _start.Date))
                            ++days;
                    }
                    _start = _start.AddDays(1);
                }

                var _extraBlocks = 0;
                _start = RoundToNearestMinutes(Start, 30);
                _end = RoundToNearestMinutes(End, 30);

                //for startdate
                var _d1 = _start.Date.AddMinutes(StartMinutes); //9:00
                var _d2 = _start.Date.AddMinutes(EndMinutes); //18:00

                if (_start < _d1) //before 9:00
                {
                    _extraBlocks = _extraBlocks + Convert.ToInt32(Math.Round((_d1 - _start).TotalMinutes / 30, 0));
                }
                else if (_start > _d1 && _start < _d2) //between 9:00 - 18:00
                {
                    --days;
                    _extraBlocks = _extraBlocks + Convert.ToInt32(Math.Round((_d2 - _start).TotalMinutes / 30, 0));

                }
                else if (_start > _d2) //after 18:00
                {
                    --days;
                    _extraBlocks = _extraBlocks + Convert.ToInt32(Math.Round((_start - _d2).TotalMinutes / 30, 0));

                }

                //for enddate
                _d1 = _end.Date.AddMinutes(StartMinutes); //9:00
                _d2 = _end.Date.AddMinutes(EndMinutes);   //18:00

                if (_end < _d1)//before 9:00
                {
                    _extraBlocks = _extraBlocks + Convert.ToInt32(Math.Round((_d1 - Start).TotalMinutes / 30, 0));
                    --days;
                }
                else if (_end > _d1 && _end < _d2) //between 9:00 - 18:00
                {
                    --days;
                    _extraBlocks = _extraBlocks + Convert.ToInt32(Math.Round((_end - _d1).TotalMinutes / 30, 0));

                }
                else if (_end > _d2)//after 18:00
                {
                    _extraBlocks = _extraBlocks + Convert.ToInt32(Math.Round((_end - _d2).TotalMinutes / 30, 0));

                }

                _blocks = _extraBlocks + days * _blocksPerDay;

            }
            else
            {

                // _blocks = 18;

                var _start = RoundToNearestMinutes(Start, 30);
                var _end = RoundToNearestMinutes(End, 30);

                _blocks = Convert.ToInt32(Math.Round((_end - _start).TotalMinutes, 0) / 30);

            }

            return _blocks;
       
    }


    public static DateTime GetBussinessDateTimeIST(DateTime Workdate, IEnumerable<DateTime> Holidays, int StartMinutes = 0, int EndMinutes = 1440, bool IsStart = false, bool IncludeSaturdays = false, bool IncludeSundays = false)
    {

        var _next = Workdate;


        var _start = _next.Date.AddMinutes(StartMinutes);
        var _end = _next.Date.AddMinutes(EndMinutes);

        if (_next < _start) //before 9:00
        {

            _next = _start;

        }

        while (_next > _end) //after 18:00
        {
            var _difference = (_next - _end).TotalHours;
            _next = _start.AddDays(1).AddHours(_difference);

            _end = _next.Date.AddMinutes(EndMinutes);
        }

        if (_next == _end && IsStart)
        {
            _start = _next.Date.AddMinutes(StartMinutes);
            _next = _start.AddDays(1);
        }

        while (Holidays != null && Holidays.Any(x => x == _next.Date))
        {
            _next = _next.AddDays(1);
        }


        _next = GetIST(_next);

        _next = _next.DayOfWeek == DayOfWeek.Saturday ? _next.AddDays(2) : _next;

        _next = _next.DayOfWeek == DayOfWeek.Sunday ? _next.AddDays(1) : _next;

        _next = GetUTC(_next);


        return _next;

    }

    public static DateTime GetBussinessDateTimeUTC(DateTime Workdate, IEnumerable<DateTime> Holidays, int StartMinutes = 0, int EndMinutes = 1440, bool IsStart = false, bool IncludeSaturdays = false, bool IncludeSundays = false)
    {

        var _next = Workdate;


        var _start = _next.Date.AddMinutes(StartMinutes);
        var _end = _next.Date.AddMinutes(EndMinutes);

        if (_next < _start) //before 9:00
        {

            _next = _start;

        }



        while (_next > _end) //after 18:00
        {
            var _difference = (_next - _end).TotalHours;
            _next = _start.AddDays(1).AddHours(_difference);

            _end = _next.Date.AddMinutes(EndMinutes);
        }

        if (_next == _end && IsStart)
        {
            _start = _next.Date.AddMinutes(StartMinutes);
            _next = _start.AddDays(1);
        }

        while (Holidays != null && Holidays.Any(x => x == _next.Date))
        {
            _next = _next.AddDays(1);
        }

        _next = _next.DayOfWeek == DayOfWeek.Saturday ? _next.AddDays(2) : _next;

        _next = _next.DayOfWeek == DayOfWeek.Sunday ? _next.AddDays(1) : _next;


        return _next;

    }


    public static DateTime GetBussinessEndDateTimeIST(DateTime Workdate, double DurationHours, IEnumerable<DateTime> Holidays, int StartMinutes = 0, int EndMinutes = 1440, bool IncludeSaturdays = false, bool IncludeSundays = false)
    {


        var _start = GetIST(Workdate);

        var _d1 = _start.Date.AddMinutes(StartMinutes + 330);
        var _d2 = _start.Date.AddMinutes(EndMinutes + 330);
        var _hoursPerDay = (_d2 - _d1).TotalHours;


        if (_start.AddHours(DurationHours) <= _d2)
        { //if Same Day <= 18:00
            return TimeZoneInfo.ConvertTimeToUtc(_start.AddHours(DurationHours),
             TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
        }


        var _balance = DurationHours - (_d2 - _start).TotalHours;

        var _next = _start.Date.AddDays(1).AddMinutes(StartMinutes + 330);
        _next = GetBussinessDateTimeUTC(_next, Holidays, StartMinutes, EndMinutes);

        while (_balance > _hoursPerDay)
        {

            _next = GetBussinessDateTimeUTC(_next.AddDays(1), Holidays, StartMinutes, EndMinutes);

            _balance = _balance - _hoursPerDay;

        }
        _next = _next.AddHours(_balance);

        return TimeZoneInfo.ConvertTimeToUtc(_next,
        TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));


    }

    public static double GetUnixTimestamp(DateTime date)
    {
        var epoch = new DateTime(1970, 1, 1, 0, 0, 0);
        return (date - epoch).TotalSeconds;
    }

    public static DateTime UnixTimeToDateTime(long unixtime)
    {
        DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0);
        dtDateTime = dtDateTime.AddSeconds(unixtime);
        return dtDateTime;
    }
}