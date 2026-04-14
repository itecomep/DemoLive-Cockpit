namespace MyCockpitView.WebApi.AuthModule.Exceptions;

public class UserNotFoundException : Exception
{
    private UserNotFoundException() : base("User not found.") { }
    public static UserNotFoundException Instance { get; } = new();
}