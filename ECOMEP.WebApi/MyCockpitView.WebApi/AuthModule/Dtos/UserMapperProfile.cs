using AutoMapper;
using MyCockpitView.WebApi.AuthModule.Entities;

namespace MyCockpitView.WebApi.AuthModule.Dtos;

public class UserMapperProfile : Profile
{
    public UserMapperProfile()
    {

        CreateMap<UserLoginDto, User>();

        CreateMap<UserSignUpDto, User>();

        CreateMap<User, UserDto>()
            .ReverseMap();
    }
}