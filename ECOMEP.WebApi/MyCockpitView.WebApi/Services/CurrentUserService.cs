namespace MyCockpitView.WebApi.Services;

public interface ICurrentUserService
{
    string? GetCurrentUsername();
    string? GetRemoteIpAddress();
    string GetUserAgent();
    Dictionary<string, string> GetRequestHeaders();
    string GetHeaderValue(string headerName);
    string? GetCachedUsername();
    void SetCachedUsername(string? username);
}

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly AsyncLocal<string?> _cachedUsername = new AsyncLocal<string?>();
    private readonly ILogger<CurrentUserService> _logger;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor, ILogger<CurrentUserService> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public string? GetCachedUsername()
    {
        return _cachedUsername.Value;
    }

    public void SetCachedUsername(string? username)
    {
        _cachedUsername.Value = username;
    }

    public string? GetCurrentUsername()
    {
        // First check cached username
        var cachedUsername = GetCachedUsername();
        if (!string.IsNullOrEmpty(cachedUsername))
        {
            return cachedUsername;
        }

        // Get from claims if not cached
        var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        
        // Cache the username if found
        if (!string.IsNullOrEmpty(username))
        {
            SetCachedUsername(username);
            _logger.LogDebug("Username {Username} cached for current scope", username);
        }
        else
        {
            _logger.LogWarning("No username found in current context");
        }

        return username;
    }

    public string? GetRemoteIpAddress()
    {
        return _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();
    }

    public string GetUserAgent()
    {
        return _httpContextAccessor.HttpContext?.Request.Headers["User-Agent"].ToString() ?? string.Empty;
    }

    public Dictionary<string, string> GetRequestHeaders()
    {
        var headers = new Dictionary<string, string>();

        if (_httpContextAccessor.HttpContext?.Request.Headers == null)
            return headers;

        foreach (var header in _httpContextAccessor.HttpContext.Request.Headers)
        {
            headers[header.Key] = header.Value.ToString();
        }

        return headers;
    }

    public string GetHeaderValue(string headerName)
    {
        return _httpContextAccessor.HttpContext?.Request.Headers[headerName].ToString() ?? string.Empty;
    }
}
