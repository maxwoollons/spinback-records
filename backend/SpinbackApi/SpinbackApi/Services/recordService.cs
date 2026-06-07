using Microsoft.EntityFrameworkCore;
using SpinbackApi.Data;
using SpinbackApi.Models;
using SpinbackApi.Models.SpinbackApi.Models;
using System.Text.Json;

public static class RecordService
{
    public static async Task<List<Record>> GetAll(SpinbackDbContext db, string? artist = null, bool? available = null)
    {
        List<Record> records = db.Records.ToList();

        if (artist != null)
            records = records.Where(r => r.Artist?.ToLower().Contains(artist.ToLower()) == true).ToList();

        if (available != null)
            records = records.Where(r => r.Available == available).ToList();

        List<Hire> activeHires = db.Hires
            .Where(h => h.ReturnedAt == null)
            .ToList();

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("User-Agent", "SpinbackApi/1.0 (emailtestingpineapple@gmail.com)");

        foreach (var record in records)
        {
            Hire? hire = activeHires.FirstOrDefault(h => h.RecordId == record.Id);
            record.HiredBy = hire?.FirstName ?? "Unknown";
            record.HiredAt = hire?.HiredAt ?? null;

            if (record.MbId != null) continue;

            string query = $"releasegroup:{record.Title} AND artist:{record.Artist}";
            string encoded = Uri.EscapeDataString(query);
            string url = $"https://musicbrainz.org/ws/2/release-group/?query={encoded}&fmt=json&limit=1";

            HttpResponseMessage response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode) continue;

            string json = await response.Content.ReadAsStringAsync();
            MusicBrainzReleaseGroupResponse? result = JsonSerializer.Deserialize<MusicBrainzReleaseGroupResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            MusicBrainzReleaseGroup? match = result?.ReleaseGroups?.FirstOrDefault();
            if (match == null) continue;

            record.MbId = match.Id;

            await Task.Delay(1100);
        }

        db.SaveChanges();

        return records;
    }

    public static async Task<Record?> GetById(SpinbackDbContext db, int id)
    {
        Record? record = db.Records.FirstOrDefault(r => r.Id == id);

        if (record == null) return null;

        Hire? hire = db.Hires.FirstOrDefault(h => h.RecordId == id && h.ReturnedAt == null);
        record.HiredBy = hire?.FirstName ?? "Unknown";
        record.HiredAt = hire?.HiredAt ?? null;

        if (record.MbId == null)
        {
            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("User-Agent", "SpinbackApi/1.0 (emailtestingpineapple@gmail.com)");

            string query = $"releasegroup:{record.Title} AND artist:{record.Artist}";
            string encoded = Uri.EscapeDataString(query);
            string url = $"https://musicbrainz.org/ws/2/release-group/?query={encoded}&fmt=json&limit=1";

            HttpResponseMessage response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string json = await response.Content.ReadAsStringAsync();
                MusicBrainzReleaseGroupResponse? result = JsonSerializer.Deserialize<MusicBrainzReleaseGroupResponse>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                MusicBrainzReleaseGroup? match = result?.ReleaseGroups?.FirstOrDefault();
                if (match != null)
                {
                    record.MbId = match.Id;
                    db.SaveChanges();
                }
            }
        }
        return record;
    }

    public static void AddRecord(SpinbackDbContext db, Record record)
    {
        db.Records.Add(record);
        db.SaveChanges();
    }

    public static Hire? HireRecord(SpinbackDbContext db, int recordId, string firstName)
    {
        Record? record = db.Records.FirstOrDefault(r => r.Id == recordId);

        if (record == null || !record.Available) return null;

        record.Available = false;

        Hire hire = new Hire
        {
            RecordId = recordId,
            FirstName = firstName,
            HiredAt = DateTime.UtcNow
        };

        db.Hires.Add(hire);
        db.SaveChanges();
        return hire;
    }

    public static ReturnResult ReturnRecord(SpinbackDbContext db, int recordId)
    {
        Record? record = db.Records.FirstOrDefault(r => r.Id == recordId);
        if (record == null) return ReturnResult.NotFound;

        Hire? hire = db.Hires
            .Include(h => h.Record)
            .Where(h => h.RecordId == recordId && h.ReturnedAt == null)
            .FirstOrDefault();

        if (hire == null) return ReturnResult.NotHiredOut;

        hire.ReturnedAt = DateTime.UtcNow;
        hire.Record.Available = true;

        db.SaveChanges();
        return ReturnResult.Success;
    }

    public static DeleteRecordResponse DeleteRecord(SpinbackDbContext db, int recordId)
    {
        Record? record = db.Records.FirstOrDefault(r => r.Id == recordId);
        if (record == null) return new DeleteRecordResponse { Success = false, Message = "Record not found" };
        Hire? activeHire = db.Hires.FirstOrDefault(h => h.RecordId == recordId && h.ReturnedAt == null);
        if (activeHire != null) return new DeleteRecordResponse { Success = false, Message = "Cannot delete a record that is currently hired out" };
        db.Records.Remove(record);
        db.SaveChanges();
        return new DeleteRecordResponse { Success = true, Message = "Record deleted successfully" };
    }
}