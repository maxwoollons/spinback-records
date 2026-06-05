using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using SpinbackApi.Data;
using SpinbackApi.Models;
using System.Text.Json;

namespace SpinbackApi.SpinbackApiFunctions;

public class getRecords
{
    private readonly SpinbackDbContext _db;

    public getRecords(SpinbackDbContext db)
    {
        _db = db;
    }

    [Function("getRecords")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        return new OkObjectResult(RecordService.GetAll(_db));
    }
}

public class getRecordById
{
    private readonly SpinbackDbContext _db;

    public getRecordById(SpinbackDbContext db)
    {
        _db = db;
    }

    [Function("getRecordById")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getRecordById/{id}")] HttpRequest req, int id)
    {
        var record = RecordService.GetById(_db, id);

        if (record == null) return new NotFoundResult();

        return new OkObjectResult(record);
    }
}

public class addRecord
{
    private readonly SpinbackDbContext _db;

    public addRecord(SpinbackDbContext db)
    {
        _db = db;
    }

    [Function("addRecord")]
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "addRecord")] HttpRequest req)
    {
        var body = await new StreamReader(req.Body).ReadToEndAsync();
        var record = JsonSerializer.Deserialize<Record>(body);

        if (record == null) return new BadRequestResult();

        RecordService.AddRecord(_db, record);
        return new OkObjectResult(record);
    }
}
