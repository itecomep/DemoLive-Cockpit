using AutoMapper;
using MyCockpitView.WebApi.HrModule.Entities;

namespace MyCockpitView.WebApi.HrModule.Dtos;

public class DepartmentDto
{
    public int ID { get; set; }

    public string? Title { get; set; }
}

public class DepartmentMapperProfile : Profile
{
    public DepartmentMapperProfile()
    {
        CreateMap<Department, DepartmentDto>()
            .ReverseMap();
    }
}