using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SpinbackApi.Data;
using SpinbackApi.Models;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Services.AddDbContext<SpinbackDbContext>(options =>
    options.UseSqlite("Data Source=spinback.db"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SpinbackDbContext>();
    db.Database.EnsureCreated();

    if (!db.Records.Any())
    {
        db.Records.AddRange(
            new Record { Title = "Rumours", Artist = "Fleetwood Mac", Available = true },
            new Record { Title = "Kind of Blue", Artist = "Miles Davis", Available = true },
            new Record { Title = "Back in Black", Artist = "AC/DC", Available = false },
            new Record { Title = "Thriller", Artist = "Michael Jackson", Available = true },
            new Record { Title = "The Dark Side of the Moon", Artist = "Pink Floyd", Available = true }
        );
        db.SaveChanges();
    }
}
app.Run();