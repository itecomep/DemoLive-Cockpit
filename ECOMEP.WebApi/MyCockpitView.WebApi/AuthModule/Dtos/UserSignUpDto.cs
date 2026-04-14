
using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AuthModule.Dtos;

public class UserSignUpDto : UserLoginDto
{
   

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }

        public bool IsChangePassword { get; set; }
}