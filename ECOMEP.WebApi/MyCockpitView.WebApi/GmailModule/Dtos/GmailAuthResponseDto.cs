namespace GmailModule.Dtos
{
    public class GmailAuthResponseDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public int ExpiresIn { get; set; }
    }
}
