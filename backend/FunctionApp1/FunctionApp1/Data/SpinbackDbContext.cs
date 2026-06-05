using Microsoft.EntityFrameworkCore;
using SpinbackApi.Models;
using SpinbackApi.Models.SpinbackApi.Models;

namespace SpinbackApi.Data
{
    public class SpinbackDbContext : DbContext
    {
        public SpinbackDbContext(DbContextOptions<SpinbackDbContext> options) : base(options) { }

        public DbSet<Record> Records { get; set; }
        public DbSet<Hire> Hires { get; set; }

    }

}