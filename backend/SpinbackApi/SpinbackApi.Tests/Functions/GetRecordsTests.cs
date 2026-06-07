namespace SpinbackApi.Tests.Functions;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpinbackApi.Data;

public class GetRecordsTests
{
    private SpinbackDbContext GetInMemoryDb()
    {
        var options = new DbContextOptionsBuilder<SpinbackDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        var db = new SpinbackDbContext(options);

        db.Records.AddRange(
            new SpinbackApi.Models.Record { Id = 1, Title = "Rumours", Artist = "Fleetwood Mac", Available = true },
            new SpinbackApi.Models.Record { Id = 2, Title = "Thriller", Artist = "Michael Jackson", Available = false }
        );
        db.SaveChanges();

        return db;
    }

    [Fact]
    public async Task GetAll_ReturnsAllRecords()
    {
        var db = GetInMemoryDb();
        var records = await RecordService.GetAll(db);

        Assert.Equal(2, records.Count);
    }

    [Fact]
    public async Task GetAll_FiltersByArtist()
    {
        var db = GetInMemoryDb();
        var records = await RecordService.GetAll(db, artist: "fleetwood");

        Assert.Single(records);
        Assert.Equal("Fleetwood Mac", records[0].Artist);
    }

    [Fact]
    public async Task GetAll_FiltersByAvailable()
    {
        var db = GetInMemoryDb();
        var records = await RecordService.GetAll(db, available: true);

        Assert.Single(records);
        Assert.True(records[0].Available);
    }

    [Fact]
    public async Task GetAll_FiltersByArtistAndAvailable()
    {
        var db = GetInMemoryDb();
        var records = await RecordService.GetAll(db, artist: "michael", available: false);

        Assert.Single(records);
        Assert.Equal("Michael Jackson", records[0].Artist);
    }

    [Fact]
    public async Task GetAll_ReturnsEmpty_WhenNoMatch()
    {
        var db = GetInMemoryDb();
        var records = await RecordService.GetAll(db, artist: "nobody");

        Assert.Empty(records);
    }
}