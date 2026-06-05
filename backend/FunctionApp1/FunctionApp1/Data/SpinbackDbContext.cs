using Microsoft.EntityFrameworkCore;
using SpinbackApi.Models;

namespace SpinbackApi.Data
{
    public class SpinbackDbContext : DbContext
    {
        public SpinbackDbContext(DbContextOptions<SpinbackDbContext> options) : base(options) { }

        public DbSet<Record> Records { get; set; }
    }
}