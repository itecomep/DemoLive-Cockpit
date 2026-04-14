using MyCockpitView.WebApi.TodoModule.Entities;
using MyCockpitView.WebApi.Services;

namespace MyCockpitView.WebApi.TodoModule.Services;
public interface ITodoAttachmentService : IBaseAttachmentService<TodoAttachment>
{
}

public class TodoAttachmentService : BaseAttachmentService<TodoAttachment>, ITodoAttachmentService
{

    public TodoAttachmentService(EntitiesContext db) : base(db)
    {
    }

}