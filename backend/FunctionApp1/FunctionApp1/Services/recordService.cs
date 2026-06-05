using SpinbackApi.Data;
using SpinbackApi.Models;

public static class RecordService
{
    public static List<Record> GetAll(SpinbackDbContext db)
    {
        return db.Records.ToList();
    }

    public static Record? GetById(SpinbackDbContext db, int id)
    {
        return db.Records.FirstOrDefault(r => r.Id == id);
    }

    public static void AddRecord(SpinbackDbContext db, Record record)
    {
        db.Records.Add(record);
        db.SaveChanges();
    }
}