using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using SpinbackApi.Models;

namespace SpinbackApi.SpinbackApiFunctions;

public class sampleFunction
{
    private readonly ILogger<sampleFunction> _logger;

    public sampleFunction(ILogger<sampleFunction> logger)
    {
        _logger = logger;
    }

    [Function("Function1")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        return new OkObjectResult("Welcome to Azure Functions!");
    }
}

public class getRecords
{
    [Function("getRecords")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
    {
        return new OkObjectResult(RecordStore.Records);
    }

}