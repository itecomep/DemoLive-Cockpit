
using Microsoft.AspNetCore.Identity;

using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AuthModule.Entities
{
    public class Role : IdentityRole<Guid>
    {

        [StringLength(50)]
        public string? Module { get; set; }

        [StringLength(50)]
        public string? Group { get; set; }

        [StringLength(50)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public bool IsSpecial { get; set; }
        public bool IsHidden { get; set; }
        public bool IsDefault { get; set; }

        public int OrderFlag { get; set; }
    }
}