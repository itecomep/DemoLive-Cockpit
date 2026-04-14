
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AuthModule.Dtos;

public class UserLoginDto
{
    [Display(Name = "Username")]
    public string? Username { get; set; }


    [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters int.", MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Password")]
    public string? Password { get; set; }

    public string? UserAgent { get; set; }
    public string? OS { get; set; }
    public string? Browser { get; set; }
    public string? Device { get; set;}
    public string? DeviceType { get; set; }
    public string? GeoLocation { get; set; }
    public string? OTP { get; set; }

}

public class UserLogOutDto
{
    public string? Username { get; set; }
    public string? Token { get; set; }
}

public class RefreshTokenDto
{
    [Display(Name = "Token")]
    public string? Token { get; set; }
}

public class EmailOTPVerificationDto
{
    [Required]
    [Display(Name = "SessionId")]
    public Guid SessionId { get; set; }

    [Required]
    [Display(Name = "otp")]
    public string? OTP { get; set; }
}