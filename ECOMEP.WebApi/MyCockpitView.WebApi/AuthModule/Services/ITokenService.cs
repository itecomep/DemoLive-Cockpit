using MyCockpitView.WebApi.AuthModule.Entities;

namespace MyCockpitView.WebApi.AuthModule.Services;

/// <summary>
/// Interface for generating token.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates token based on user information.
    /// </summary>
    /// <param name="user"><see cref="User"/> instance.</param>
    /// <returns>Generated token.</returns>
    string Generate(User user);
}
