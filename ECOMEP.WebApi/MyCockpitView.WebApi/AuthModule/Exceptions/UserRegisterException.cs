namespace MyCockpitView.WebApi.AuthModule.Exceptions;

public class UserRegisterException : Exception
{
    private UserRegisterException() : base("Error occured while registering user.") { }
    public static UserRegisterException Instance { get; } = new();
}