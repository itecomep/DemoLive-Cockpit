using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MyCockpitView.WebApi.HrModule.Entities;

public class Department
{
    public int ID { get; set; }

    public string? Title { get; set; }
}

public class DepartmentConfiguration
    : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.HasKey(x => x.ID);

        builder.Property(x => x.ID)
            .ValueGeneratedOnAdd();
    }
}