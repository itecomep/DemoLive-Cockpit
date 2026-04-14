using System.Text.Json;
using System.Text.Json.Serialization;

namespace MyCockpitView.WebApi.Settings;

public class DateTimeConverter : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TryGetDateTime(out DateTime dateTime))
        {
            return dateTime.ToUniversalTime();
            // return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        }

        return default;
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToUniversalTime());
        // writer.WriteStringValue(value.ToString("yyyy-MM-ddTHH:mm:ss.fffffffK"));
    }
}