using System.ComponentModel.DataAnnotations;

namespace MyCockpitView.WebApi.AuthModule.Dtos;
    public class RoleDto
    {
        public Guid Id { get; set; }
    public string? Name { get; set; }
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
    public bool IsAssigned { get; set; }
}

public class AddRemoveRoleDto
{
    public string? Username { get; set; }
    public string[] Roles { get; set; }
}
