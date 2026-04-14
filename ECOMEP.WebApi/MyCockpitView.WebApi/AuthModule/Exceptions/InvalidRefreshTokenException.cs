namespace MyCockpitView.WebApi.AuthModule.Exceptions;

public class InvalidRefreshTokenException : Exception
{
    private InvalidRefreshTokenException() : base("Refresh token is not valid.") { }
    public static InvalidRefreshTokenException Instance { get; } = new();
}