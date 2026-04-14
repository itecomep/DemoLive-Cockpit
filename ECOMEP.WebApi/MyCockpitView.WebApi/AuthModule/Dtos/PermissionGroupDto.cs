using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;

namespace MyCockpitView.WebApi.AuthModule.Dtos
{
    public class PermissionGroupDto :BaseEntityDto
    {
        public string Title { get; set; }
        public ICollection<string>? RoleCodes { get; set; }
    }
}

public class PermissionGroupDtoMapperProfile : Profile
{
    public PermissionGroupDtoMapperProfile()
    {
        CreateMap<PermissionGroup, PermissionGroupDto>()
            .ReverseMap();
         
            
    }
}