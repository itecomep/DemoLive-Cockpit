using AutoMapper;
using MyCockpitView.WebApi.TodoModule.Entities;

namespace MyCockpitView.WebApi.TodoModule.Dtos;

public class TodoMapperProfile:Profile
{
    public TodoMapperProfile()
    {
        CreateMap<Todo, TodoDto>().ForMember(dest => dest.IsDelayed, opt => opt.MapFrom(src => src.StatusFlag != 1
                                                                  && (src.DueDate < DateTime.UtcNow) ? true : false))
               .ReverseMap()
               .ForMember(dest => dest.Attachments, opt => opt.Ignore())
               .ForMember(dest => dest.Agendas, opt => opt.Ignore())
               .ForMember(dest => dest.Assigner, opt => opt.Ignore())
               .ForMember(dest => dest.Assignee, opt => opt.Ignore());

        CreateMap<Todo, TodoListDto>()
            .ForMember(dest => dest.IsDelayed, opt => opt.MapFrom(src => src.StatusFlag != 1
                                                               && (src.DueDate < DateTime.UtcNow) ? true : false));

        CreateMap<TodoAttachment, TodoAttachmentDto>()
.ReverseMap().ForMember(dest => dest.Todo, opt => opt.Ignore());



        CreateMap<TodoAgenda, TodoAgendaDto>()
            .ReverseMap()
            .ForMember(dest => dest.Todo, opt => opt.Ignore());
    }
}
