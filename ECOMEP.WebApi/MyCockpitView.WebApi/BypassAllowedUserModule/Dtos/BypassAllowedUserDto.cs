namespace MyCockpitView.WebApi.BypassAllowedUserModule.Dtos
{
    public class BypassAllowedUserDto
    {
        public string Username { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}