using AutoMapper;
using MyCockpitView.CoreModule;
using MyCockpitView.WebApi.AuthModule.Dtos;
using MyCockpitView.WebApi.AuthModule.Entities;

namespace MyCockpitView.WebApi.AuthModule.Dtos
{
    public class UserPermissionGroupMapDto : BaseEntityDto
    {
     
        public int UserID { get; set; }
        public int PermissionGroupID { get; set; }
    }
}

public class UserPermissionGroupMapDtoMapperProfile : Profile
{
    public UserPermissionGroupMapDtoMapperProfile()
    {
        CreateMap<UserPermissionGroupMap, UserPermissionGroupMapDto>()
            .ReverseMap();


    }
}