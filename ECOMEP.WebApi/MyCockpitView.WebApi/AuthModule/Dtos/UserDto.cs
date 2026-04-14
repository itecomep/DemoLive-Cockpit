namespace MyCockpitView.WebApi.AuthModule.Dtos
{
    public class UserDto
    {
        public string? Id { get; set; }
        public string? Username { get; set; }
        public bool IsChangePassword { get; set; }
        public int AgreementFlag { get; set; }
    }
}