using Microsoft.EntityFrameworkCore;
using MyCockpitView.CoreModule;

using System.Diagnostics;
using System.Linq.Expressions;
using System.Reflection;
using MyCockpitView.WebApi.Exceptions;

namespace MyCockpitView.WebApi.Services;
public interface IBaseEntityService<T>
{
    IQueryable<T> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null);
    Task<T> GetById(int Id);
    Task<T> GetById(Guid Id);
    Task<int> Create(T _model);
    Task Update(T Entity);
    Task Delete(int Id);
    Task<IEnumerable<string>> GetSearchTagOptions();
    Task<IEnumerable<string>> GetFieldOptions(string field);
}
public class BaseEntityService<T> : IBaseEntityService<T> where T : BaseEntity, new()
{
    protected readonly EntitiesContext db;


    public BaseEntityService(EntitiesContext db)
    {
        this.db = db;
    }
    public IQueryable<T> Get(IEnumerable<QueryFilter>? Filters = null, string? Search = null, string? Sort = null)
    {

        IQueryable<T> _query = db.Set<T>().AsNoTracking();

        //Apply filters
        if (Filters != null)
        {


            if (Filters.Where(x => x.Key.Equals("searchtag", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<T>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("searchtag", StringComparison.OrdinalIgnoreCase)))
                {
                    predicate = predicate.Or(x => x._searchTags.Contains(_item.Value));
                }
                _query = _query.Where(predicate);
            }
            if (Filters.Where(x => x.Key.Equals("statusFlag", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<T>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("statusFlag", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.StatusFlag == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("typeFlag", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<T>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("typeFlag", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.TypeFlag == isNumeric);
                }
                _query = _query.Where(predicate);
            }

            if (Filters.Where(x => x.Key.Equals("id", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<T>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("id", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.ID == isNumeric);
                }
                _query = _query.Where(predicate);

            }

            if (Filters.Where(x => x.Key.Equals("uid", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<T>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("uid", StringComparison.OrdinalIgnoreCase)))
                {

                    predicate = predicate.Or(x => x.UID.ToString() == _item.Value);
                }
                _query = _query.Where(predicate);

            }

            if (Filters.Where(x => x.Key.Equals("CreatedByContactID", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var predicate = PredicateBuilder.False<T>();
                foreach (var _item in Filters.Where(x => x.Key.Equals("CreatedByContactID", StringComparison.OrdinalIgnoreCase)))
                {
                    var isNumeric = Convert.ToInt32(_item.Value);

                    predicate = predicate.Or(x => x.CreatedByContactID == isNumeric);
                }
                _query = _query.Where(predicate);

            }

            if (Filters.Where(x => x.Key.Equals("isDeleted", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var value = Convert.ToBoolean(Filters.FirstOrDefault(x => x.Key.Equals("isDeleted", StringComparison.OrdinalIgnoreCase)).Value);
                if (value)
                {
                    _query = _query.IgnoreQueryFilters();
                }
            }

            if (Filters.Where(x => x.Key.Equals("CreatedRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("CreatedRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.Created >= result);
            }

            if (Filters.Where(x => x.Key.Equals("CreatedRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("CreatedRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.Created < end);

            }


            if (Filters.Where(x => x.Key.Equals("ModifiedRangeStart", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("ModifiedRangeStart", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                _query = _query.Where(x => x.Modified >= result);
            }

            if (Filters.Where(x => x.Key.Equals("ModifiedRangeEnd", StringComparison.OrdinalIgnoreCase)).Any())
            {
                var _item = Filters.First(x => x.Key.Equals("ModifiedRangeEnd", StringComparison.OrdinalIgnoreCase));

                DateTime result = Convert.ToDateTime(_item.Value);
                var end = result.AddDays(1);
                _query = _query.Where(x => x.Modified < end);

            }

        }

        if (Search != null && Search != string.Empty)
        {
            var _key = Search.Trim();
            _query = _query.Where(x => x._searchTags.ToLower().Contains(_key));
            
        }

        if (Sort != null && Sort != string.Empty)
        {
            switch (Sort.ToLower())
            {
                case "createddate":
                    return _query
                            .OrderBy(x => x.Created);

                case "createddate desc":
                    return _query
                            .OrderByDescending(x => x.Created);

                case "modifieddate":
                    return _query
                            .OrderBy(x => x.Modified);

                case "modifieddate desc":
                    return _query
                            .OrderByDescending(x => x.Modified);

                case "orderflag":
                    return _query
                            .OrderBy(x => x.OrderFlag);
            }
        }

        return _query.OrderBy(x => x.OrderFlag);


    }

    public async Task<T> GetById(int Id)
    {

        return await Get()
            .AsNoTracking().SingleOrDefaultAsync(i => i.ID == Id);

    }

    public async Task<T> GetById(Guid Id)
    {

        var query = await Get()
             .SingleOrDefaultAsync(i => i.UID == Id);


        return query;

    }

    public async Task<int> Create(T Entity)
    {
            db.Set<T>().Add(Entity);
            await db.SaveChangesAsync();

            return Entity.ID;
    }

    public async Task Update(T Entity)
    {

        db.Entry(Entity).State = EntityState.Modified;
        await db.SaveChangesAsync();

    }

    public async Task Delete(int Id)
    {

        var _entity = await db.Set<T>()
             .SingleOrDefaultAsync(i => i.ID == Id);

        if (_entity == null) throw new EntityServiceException($"{nameof(T)} not found!");

        db.Entry(_entity).State = EntityState.Deleted;
        await db.SaveChangesAsync();

    }

    public async Task<IEnumerable<string>> GetSearchTagOptions()
    {

        var _tags = (await db.Set<T>().AsNoTracking().ToListAsync())
            .Select(x => x.SearchTags);
        var _options = new HashSet<string>();

        foreach (var item in _tags)
        {
            foreach (var tag in item)
            {
                _options.Add(tag);
            }
        }

        return _options.Distinct().OrderBy(x => x);

    }

    public async Task<IEnumerable<string>> GetFieldOptions(string columnName)
    {
        ParameterExpression parameterExpression = Expression.Parameter(typeof(T), "p");
        Expression<Func<T, object>> column = Expression.Lambda<Func<T, object>>(Expression.PropertyOrField(parameterExpression, columnName), parameterExpression);

        var values = await db.Set<T>().AsNoTracking()
            .Select(column)
            .Where(x => x != null)
             .Select(x => x.ToString())
        .Distinct()
        .ToListAsync();

        return values;

    }


    /// <summary>
    ///  filters data based on ColumnName and Value
    ///  var query = ApplyFilter<Customer>(db.Customers, "CustomerID", "ALFKI");
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <param name="propertyName"></param>
    /// <param name="propertyValue"></param>
    /// <returns></returns>
    private IQueryable<T> ApplyFilter(IQueryable<T> query, string propertyName, string propertyValue)
    {
        try
        {
            PropertyInfo propertyInfo = typeof(T).GetProperty(propertyName);
            ParameterExpression e = Expression.Parameter(typeof(T), "e");
            MemberExpression m = Expression.MakeMemberAccess(e, propertyInfo);
            ConstantExpression c = Expression.Constant(propertyValue, propertyValue.GetType());
            BinaryExpression b = Expression.Equal(m, c);

            Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(b, e);
            return query.Where(lambda);
        }
        catch (Exception e)
        {
            Debug.WriteLine($"ApplyFilter Execption:{e.Message}\n{e.StackTrace}");
            return query;
        }
    }

    /// <summary>
    /// method with multiple property values to filter the query using an OR condition.
    /// var query = ApplyFilter<Customer>(db.Customers, "CustomerID", ["ALFKI","ASDRAS"]);
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <param name="propertyName"></param>
    /// <param name="propertyValues"></param>
    /// <returns></returns>
    private IQueryable<T> ApplyFilter<T>(IQueryable<T> query, string propertyName, IEnumerable<string> propertyValues)
    {
        try
        {
            PropertyInfo propertyInfo = typeof(T).GetProperty(propertyName);
            ParameterExpression e = Expression.Parameter(typeof(T), "e");
            MemberExpression m = Expression.MakeMemberAccess(e, propertyInfo);

            Expression condition = null;
            foreach (string value in propertyValues)
            {
                Expression convertedValue;

                if (propertyInfo.PropertyType.IsGenericType && propertyInfo.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    Type underlyingType = Nullable.GetUnderlyingType(propertyInfo.PropertyType);

                    if (underlyingType == typeof(int))
                    {
                        int intValue;
                        if (int.TryParse(value, out intValue))
                        {
                            convertedValue = Expression.Constant(intValue, underlyingType);
                        }
                        else
                        {
                            convertedValue = Expression.Constant(null, propertyInfo.PropertyType);
                        }
                    }
                    else if (underlyingType == typeof(decimal))
                    {
                        decimal decimalValue;
                        if (decimal.TryParse(value, out decimalValue))
                        {
                            convertedValue = Expression.Constant(decimalValue, underlyingType);
                        }
                        else
                        {
                            convertedValue = Expression.Constant(null, propertyInfo.PropertyType);
                        }
                    }
                    else if (underlyingType == typeof(bool))
                    {
                        bool boolValue;
                        if (bool.TryParse(value, out boolValue))
                        {
                            convertedValue = Expression.Constant(boolValue, underlyingType);
                        }
                        else
                        {
                            convertedValue = Expression.Constant(null, propertyInfo.PropertyType);
                        }
                    }
                    else
                    {
                        convertedValue = Expression.Constant(null, propertyInfo.PropertyType);
                    }

                    MethodInfo hasValueMethod = propertyInfo.PropertyType.GetProperty("HasValue").GetGetMethod();
                    MethodInfo equalsMethod = propertyInfo.PropertyType.GetMethod("Equals", new[] { typeof(object) });

                    Expression hasValue = Expression.Property(m, hasValueMethod);
                    Expression boxedValue = Expression.Convert(convertedValue, typeof(object));
                    Expression equality = Expression.Call(m, equalsMethod, boxedValue);
                    condition = condition == null ? Expression.AndAlso(hasValue, equality) : Expression.OrElse(condition, Expression.AndAlso(hasValue, equality));
                }
                else
                {
                    if (propertyInfo.PropertyType == typeof(int))
                    {
                        int intValue;
                        if (int.TryParse(value, out intValue))
                        {
                            convertedValue = Expression.Constant(intValue);
                        }
                        else
                        {
                            convertedValue = Expression.Constant(0); // Set default value for invalid input
                        }
                    }
                    else if (propertyInfo.PropertyType == typeof(decimal))
                    {
                        decimal decimalValue;
                        if (decimal.TryParse(value, out decimalValue))
                        {
                            convertedValue = Expression.Constant(decimalValue);
                        }
                        else
                        {
                            convertedValue = Expression.Constant(0m); // Set default value for invalid input
                        }
                    }
                    else if (propertyInfo.PropertyType == typeof(bool))
                    {
                        bool boolValue;
                        if (bool.TryParse(value, out boolValue))
                        {
                            convertedValue = Expression.Constant(boolValue);
                        }
                        else
                        {
                            convertedValue = Expression.Constant(false); // Set default value for invalid input
                        }
                    }
                    else
                    {
                        convertedValue = Expression.Constant(value);
                    }

                    BinaryExpression equality = Expression.Equal(m, convertedValue);
                    condition = condition == null ? equality : Expression.OrElse(condition, equality);
                }
            }

            if (condition == null)
                return query;

            Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(condition, e);
            return query.Where(lambda);
        }
        catch (Exception e)
        {
            Debug.WriteLine($"ApplyFilter Exception: {e.Message}\n{e.StackTrace}");
            return query;
        }
    }




}
