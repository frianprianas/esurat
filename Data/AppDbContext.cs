using Microsoft.EntityFrameworkCore;
using AplikasiSurat.Models;

namespace AplikasiSurat.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.CoreEventId.ManyServiceProvidersCreatedWarning));
        }

        public DbSet<SuratMasuk> SuratMasuk { get; set; }
        public DbSet<SuratKeluar> SuratKeluar { get; set; }
        public DbSet<KategoriPerihal> KategoriPerihal { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { 
                    Id = 1, 
                    Username = "admin", 
                    Password = "on5laught", 
                    Role = "Admin", 
                    CanManageSuratMasuk = true, 
                    CanManageSuratKeluar = true, 
                    CanManagePerihal = true 
                }
            );
        }
    }
}
