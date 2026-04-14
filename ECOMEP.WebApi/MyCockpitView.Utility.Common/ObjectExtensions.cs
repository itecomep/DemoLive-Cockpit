using System.Dynamic;
using System.Reflection;

namespace MyCockpitView.Utility.Common;

public static class ObjectExtensions
{
    public static IDictionary<string, object> ToExpando(this object source)
    {
        if (source == null) throw new ArgumentNullException(nameof(source));

        var expando = new ExpandoObject() as IDictionary<string, object>;
        foreach (var property in source.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            expando.Add(property.Name, property.GetValue(source));
        }
        return expando;
    }
}
