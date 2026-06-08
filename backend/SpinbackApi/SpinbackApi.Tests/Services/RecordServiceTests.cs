namespace SpinbackApi.Tests.Services;
using Microsoft.EntityFrameworkCore;
using SpinbackApi.Data;
using SpinbackApi.Models;

public class RecordServiceTests
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
    public async Task GetById_ReturnsRecord_WhenExists()
    {
        var db = GetInMemoryDb();
        Record? record = await RecordService.GetById(db, 1);

        Assert.NotNull(record);
        Assert.Equal("Rumours", record.Title);
    }

    [Fact]
    public async Task GetById_ReturnsNull_WhenNotFound()
    {
        var db = GetInMemoryDb();
        Record? record = await RecordService.GetById(db, 99);

        Assert.Null(record);
    }

    [Fact]
    public void ReturnRecord_ReturnsNotHiredOut_WhenNotHired()
    {
        var db = GetInMemoryDb();
        ReturnRecordResponse result = RecordService.ReturnRecord(db, 1);

        Assert.True(result == ReturnRecordResponse.NotHiredOut);
    }
}