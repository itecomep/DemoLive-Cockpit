namespace MyCockpitView.WebApi.Exceptions;

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message)
    {

    }
}

public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {

    }
}

public class KeyNotFoundException : Exception
{
    public KeyNotFoundException(string message) : base(message)
    {

    }
}

public class NotImplementedException : Exception
{
    public NotImplementedException(string message) : base(message)
    {

    }
}

public class UnAuthorizedAccesException : Exception
{
    public UnAuthorizedAccesException(string message) : base(message)
    {

    }
}
