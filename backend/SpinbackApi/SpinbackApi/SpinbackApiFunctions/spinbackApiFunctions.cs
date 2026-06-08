using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using SpinbackApi.Data;
using SpinbackApi.Models;
using SpinbackApi.Models.SpinbackApi.Models;
using System.Text.Json;

namespace SpinbackApi.SpinbackApiFunctions;

//Get All Records
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
        string? artist = req.Query.ContainsKey("artist") ? req.Query["artist"].ToString() : null;
        string? availableStr = req.Query.ContainsKey("available") ? req.Query["available"].ToString() : null;
        bool? available = availableStr != null ? availableStr.ToLower() == "true" : null;

        List<Record> records = await RecordService.GetAll(_db, artist, available);
        return new OkObjectResult(records);
    }
}

//Get Record by Id
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
        Record? record = await RecordService.GetById(_db, id);

        if (record == null) return new NotFoundResult();

        return new OkObjectResult(record);
    }
}

//Add Record
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
        string body = await new StreamReader(req.Body).ReadToEndAsync();
        Record? record = JsonSerializer.Deserialize<Record>(body);

        if (record == null) return new BadRequestResult();

        RecordService.AddRecord(_db, record);
        return new OkObjectResult(record);
    }
}

//Hire Record
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
        string body = await new StreamReader(req.Body).ReadToEndAsync();
        HireRequest? payload = JsonSerializer.Deserialize<HireRequest>(body);

        if (payload == null) return new BadRequestResult();

        Hire? hire = RecordService.HireRecord(_db, id, payload.FirstName);

        if (hire == null) return new BadRequestObjectResult("Record not found or already hired out.");

        return new OkObjectResult(hire);
    }
}

//Return Record
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
        ReturnRecordResponse result = RecordService.ReturnRecord(_db, id);

        return result switch
        {
            ReturnRecordResponse.Success => new OkObjectResult("Record returned successfully."),
            ReturnRecordResponse.NotFound => new NotFoundObjectResult("Record not found."),
            ReturnRecordResponse.NotHiredOut => new BadRequestObjectResult("This record is not currently hired out."),
            _ => new StatusCodeResult(500)
        };
    }
}

//Delete
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
        DeleteRecordResponse success = RecordService.DeleteRecord(_db, id);
        if (!success.Success) return new NotFoundObjectResult("Record not found.");
        return new OkObjectResult("Record deleted successfully.");
    }
}