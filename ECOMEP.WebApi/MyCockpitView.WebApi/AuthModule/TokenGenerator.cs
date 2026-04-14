using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace MyCockpitView.WebApi.AuthModule;

/// <summary>
/// Interface for generating token.
/// </summary>
public interface ITokenGenerator
{
    /// <summary>
    /// Generates jwt token.
    /// </summary>
    /// <param name="secretKey">The secret key for security.</param>
    /// <param name="issuer">The issuer.</param>
    /// <param name="audience">The audience.</param>
    /// <param name="expires">The expire time.</param>
    /// <param name="claims"><see cref="IEnumerable{T}"/></param>
    /// <returns>Generated token.</returns>
    string Generate(string secretKey, string issuer, string audience, double expires,
        IEnumerable<Claim> claims = null);
}

public class TokenGenerator : ITokenGenerator
{
    public string? Generate(
        string secretKey,
        string issuer,
        string audience,
        double expires,
        IEnumerable<Claim> claims = null)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        JwtSecurityToken securityToken = new(issuer, audience,
            claims,
            DateTime.UtcNow,
            DateTime.UtcNow.AddMinutes(expires),
            credentials);
        return new JwtSecurityTokenHandler().WriteToken(securityToken);
    }
}
