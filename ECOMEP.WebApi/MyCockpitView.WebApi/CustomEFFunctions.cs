using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace MyCockpitView.WebApi;

public static class CustomFunctions
{
    /*
      * Define extension functions to handle basic data type conversions
      */
    public static DateTime? ToSqlDateTime(this string s, int format) => throw new NotSupportedException();
    public static int? ToSqlInt(this string s) => throw new NotSupportedException();
    public static decimal? ToSqlDecimal(this string s) => throw new NotSupportedException();
    /*
      * Define functions to handle working with JSON.  These map to the functions directly in TSQL
      */
    [DbFunction("JSON_VALUE", IsBuiltIn = true)]
    public static string JsonValue(string column, [NotParameterized] string path) => throw new NotSupportedException();
    [DbFunction("JSON_QUERY", IsBuiltIn = true)]
    public static string JsonQuery(string source, [NotParameterized] string path) => throw new NotSupportedException();
    [DbFunction("OPENJSON", IsBuiltIn = true)]
    public static string OpenJson(string source, [NotParameterized] string path) => throw new NotSupportedException();
    /// <summary>
    /// Registers tsql functions to EF
    /// </summary>
    /// <param name="modelBuilder"></param>
    /// <returns></returns>
    public static ModelBuilder AddCustomFunctions(this ModelBuilder modelBuilder)
    {
        // the first 3 functions map a string to the TRY_CONVERT function in TSQL
        modelBuilder.HasDbFunction(() => ToSqlDateTime(default, default))
            .HasTranslation(args =>
                new SqlFunctionExpression(
                    functionName: "TRY_CONVERT",
                    arguments: args.Prepend(new SqlFragmentExpression("datetime2")),
                    nullable: true,
                    argumentsPropagateNullability: new[] { false, true, false },
                    type: typeof(DateTime),
                    typeMapping: null
                )
            );
        modelBuilder.HasDbFunction(() => ToSqlInt(default))
            .HasTranslation(args =>
                new SqlFunctionExpression(
                    functionName: "TRY_CONVERT",
                    arguments: args.Prepend(new SqlFragmentExpression("int")),
                    nullable: true,
                    argumentsPropagateNullability: new[] { false, true },
                    type: typeof(int),
                    typeMapping: null
                )
            );
        modelBuilder.HasDbFunction(() => ToSqlDecimal(default))
             .HasTranslation(args =>
                 new SqlFunctionExpression(
                     functionName: "TRY_CONVERT",
                     arguments: args.Prepend(new SqlFragmentExpression("decimal")),
                     nullable: true,
                     argumentsPropagateNullability: new[] { false, true },
                     type: typeof(decimal),
                     typeMapping: null
                 )
             );
        // add support for Json functions
        modelBuilder.HasDbFunction(() => JsonValue(default, default));
        modelBuilder.HasDbFunction(() => JsonQuery(default, default));
        modelBuilder.HasDbFunction(() => OpenJson(default, default));
        return modelBuilder;
    }
}
