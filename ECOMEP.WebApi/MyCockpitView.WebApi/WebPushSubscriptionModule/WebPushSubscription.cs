using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyCockpitView.WebApi.WebPushSubscriptionModule;

public class WebPushSubscription
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required]
    [StringLength(255)]
    public string? Username { get; set; }
    public string? OS { get; set; }
    public string? Browser { get; set; }
    public string? Device { get; set; }
    public string? DeviceType { get; set; }

    [Required]
    public string? Subscription { get; set; }

}
public class WebPushSubscriptionConfiguration : IEntityTypeConfiguration<WebPushSubscription>
{
    public void Configure(EntityTypeBuilder<WebPushSubscription> builder)
    {

        builder.HasIndex(e => e.Username);
    }
}
