
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.ContactModule.Entities;

namespace MyCockpitView.WebApi.AuthModule.Entities;

public class User : IdentityUser<Guid>
{
    [StringLength(255)]
    public string? FullName { get; set; }
    public bool IsChangePassword { get; set; }
    public int AgreementFlag { get; set; }
}
