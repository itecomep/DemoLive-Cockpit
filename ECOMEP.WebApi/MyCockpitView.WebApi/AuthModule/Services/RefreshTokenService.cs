using Microsoft.IdentityModel.Tokens;
using MyCockpitView.WebApi.AuthModule.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace MyCockpitView.WebApi.AuthModule.Services;

/// <inheritdoc cref="ITokenService"/>
public interface IRefreshTokenService : ITokenService {

    /// <summary>
    /// Validates refresh token.
    /// </summary>
    /// <param name="refreshToken">The refresh token.</param>
    /// <returns>True if token is valid,otherwise false.</returns>
    bool Validate(string refreshToken);
}

public class RefreshTokenService : IRefreshTokenService
{
    private readonly EntitiesContext _context;
    private readonly JwtSettings _jwtSettings;

    public RefreshTokenService(EntitiesContext context, JwtSettings jwtSettings)
    {
        _context = context;
        _jwtSettings = jwtSettings;
    }

    public string Generate(User user)
    {
        // Generate a secure random string for the refresh token
        var tokenBytes = new byte[64];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(tokenBytes);
        }
        return Convert.ToBase64String(tokenBytes);
    }

    public bool Validate(string refreshToken)
    {
        var tokenEntity = _context.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken);
        if (tokenEntity == null) return false;
        if (tokenEntity.ExpiresAt < DateTime.UtcNow) return false;
        return true;
    }
}