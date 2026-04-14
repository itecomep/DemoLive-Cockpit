namespace MyCockpitView.WebApi.Responses;
public class PagedResponse<T>
{
    public PagedResponse(IEnumerable<T> _Data, int _Total, int _Pages)
    {
        List = _Data;
        Total = _Total;
        Pages = _Pages;
    }

    public int Total { get; set; }
    public int Pages { get; set; }
    public IEnumerable<T> List { get; set; }
}
