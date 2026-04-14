namespace MyCockpitView.WebApi.AuthModule.Exceptions;

public class UserSignInException : Exception
{
    private UserSignInException() : base("Error occured while signing in user")
    {
    }

    public static UserSignInException Instance { get; } = new();
}