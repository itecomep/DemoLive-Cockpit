using Microsoft.EntityFrameworkCore;
using MyCockpitView.WebApi.GmailModule.Entities;

namespace MyCockpitView.WebApi.GmailModule.Data
{
    public class GmailEmailContext : DbContext
    {
        public GmailEmailContext(DbContextOptions<GmailEmailContext> options) : base(options) { }
        public DbSet<GmailEmail> GmailEmails { get; set; }
        public DbSet<GmailAttachment> GmailAttachments { get; set; } = null!;
        public DbSet<GmailAttachmentData> MailAttachmentData { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure one-to-many relationship: GmailEmail → GmailAttachments
            modelBuilder.Entity<GmailAttachment>()
                .HasOne(a => a.GmailEmail)
                .WithMany(e => e.Attachments)
                .HasForeignKey(a => a.GmailEmailId)
                .OnDelete(DeleteBehavior.Cascade);
        }


    }
}
