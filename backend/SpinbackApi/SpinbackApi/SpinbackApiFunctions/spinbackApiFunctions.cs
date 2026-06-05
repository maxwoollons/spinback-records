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
    public async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        var artist = req.Query.ContainsKey("artist") ? req.Query["artist"].ToString() : null;
        var availableStr = req.Query.ContainsKey("available") ? req.Query["available"].ToString() : null;
        bool? available = availableStr != null ? availableStr.ToLower() == "true" : null;

        var records = await RecordService.GetAll(_db, artist, available);
        return new OkObjectResult(records);
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
    public async Task<IActionResult> Run(
     [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "getRecordById/{id}")] HttpRequest req, int id)
    {
        var record = await RecordService.GetById(_db, id);

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

public class hireRecord
{
    private readonly SpinbackDbContext _db;

    public hireRecord(SpinbackDbContext db)
    {
        _db = db;
    }

    [Function("hireRecord")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "records/{id}/hire")] HttpRequest req, int id)
    {
        var body = await new StreamReader(req.Body).ReadToEndAsync();
        var payload = JsonSerializer.Deserialize<HireRequest>(body);

        if (payload == null) return new BadRequestResult();

        var hire = RecordService.HireRecord(_db, id, payload.FirstName);

        if (hire == null) return new BadRequestObjectResult("Record not found or already hired out.");

        return new OkObjectResult(hire);
    }
}

public class returnRecord
{
    private readonly SpinbackDbContext _db;

    public returnRecord(SpinbackDbContext db)
    {
        _db = db;
    }

    [Function("returnRecord")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "records/{id}/return")] HttpRequest req, int id)
    {
        var success = RecordService.ReturnRecord(_db, id);

        if (!success) return new NotFoundObjectResult("No active hire found for this record.");

        return new OkObjectResult("Record returned successfully.");
    }
}

public class DeleteRecord
{
    private readonly SpinbackDbContext _db;
    public DeleteRecord(SpinbackDbContext db)
    {
        _db = db;
    }
    [Function("deleteRecord")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "deleteRecord/{id}")] HttpRequest req, int id)
    {
        var success = RecordService.DeleteRecord(_db, id);
        if (!success.Success) return new NotFoundObjectResult("Record not found.");
        return new OkObjectResult("Record deleted successfully.");
    }
}