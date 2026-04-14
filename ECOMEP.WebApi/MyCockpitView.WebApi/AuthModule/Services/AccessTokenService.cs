using System.Security.Claims;
using MyCockpitView.WebApi.AuthModule.Entities;

namespace MyCockpitView.WebApi.AuthModule.Services;

/// <inheritdoc cref="ITokenService"/>
public interface IAccessTokenService : ITokenService { }

public class AccessTokenService : IAccessTokenService
{
    private readonly ITokenGenerator _tokenGenerator;
    private readonly JwtSettings _jwtSettings;

    public AccessTokenService(ITokenGenerator tokenGenerator, JwtSettings jwtSettings) =>
        (_tokenGenerator, _jwtSettings) = (tokenGenerator, jwtSettings);

    public string? Generate(User user)
    {
        List<Claim> claims = new()
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email ?? "nit@newarchllp.com"),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        return _tokenGenerator.Generate(_jwtSettings.AccessTokenSecret, _jwtSettings.Issuer, _jwtSettings.Audience,
            _jwtSettings.AccessTokenExpirationMinutes, claims);
    }
}
