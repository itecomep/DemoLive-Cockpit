using Swashbuckle.AspNetCore.Annotations;

namespace MyCockpitView.WebApi.AuthModule;

public class AuthenticateResponse
{
    [SwaggerSchema(Required = new[] { "The access token" })]
    public string? AccessToken { get; set; }
    [SwaggerSchema(Required = new[] { "The refresh token" })]
    public string? RefreshToken { get; set; }

    public bool IsChangePassword { get; set; }

    public Guid? SessionID { get; set; }
    public bool IsOTPRequired { get; set; }
    public int UserId { get; set; }
    public bool IsOutsideIP { get; set; }
    public List<string> AllowedModules { get; set; } = new List<string>();
}