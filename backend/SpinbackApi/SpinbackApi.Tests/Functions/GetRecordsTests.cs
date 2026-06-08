namespace SpinbackApi.Tests.Functions;
using Microsoft.EntityFrameworkCore;
using SpinbackApi.Data;
using SpinbackApi.Models;

public class GetRecordsTests
{
    private SpinbackDbContext GetInMemoryDb()
    {
        var options = new DbContextOptionsBuilder<SpinbackDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var db = new SpinbackDbContext(options);

        db.Records.AddRange(
            new Record { Id = 1, Title = "Rumours", Artist = "Fleetwood Mac", Available = true },
            new Record { Id = 2, Title = "Thriller", Artist = "Michael Jackson", Available = false }
        );
        db.SaveChanges();

        return db;
    }

    [Fact]
    public async Task GetAll_ReturnsAllRecords()
    {
        var db = GetInMemoryDb();
        List<Record> records = await RecordService.GetAll(db);

        Assert.Equal(2, records.Count);
    }

    [Fact]
    public async Task GetAll_FiltersByArtist()
    {
        var db = GetInMemoryDb();
        List<Record> records = await RecordService.GetAll(db, artist: "fleetwood");

        Assert.Single(records);
        Assert.Equal("Fleetwood Mac", records[0].Artist);
    }

    [Fact]
    public async Task GetAll_FiltersByAvailable()
    {
        var db = GetInMemoryDb();
        List<Record> records = await RecordService.GetAll(db, available: true);

        Assert.Single(records);
        Assert.True(records[0].Available);
    }

    [Fact]
    public async Task GetAll_FiltersByArtistAndAvailable()
    {
        var db = GetInMemoryDb();
        List<Record> records = await RecordService.GetAll(db, artist: "michael", available: false);

        Assert.Single(records);
        Assert.Equal("Michael Jackson", records[0].Artist);
    }

    [Fact]
    public async Task GetAll_ReturnsEmpty_WhenNoMatch()
    {
        var db = GetInMemoryDb();
        List<Record> records = await RecordService.GetAll(db, artist: "nobody");

        Assert.Empty(records);
    }
}