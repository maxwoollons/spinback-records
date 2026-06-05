using Microsoft.EntityFrameworkCore;
using SpinbackApi.Data;
using SpinbackApi.Models;
using SpinbackApi.Models.SpinbackApi.Models;
using System.Text.Json;

public static class RecordService
{
    public static async Task<List<Record>> GetAll(SpinbackDbContext db, string? artist = null, bool? available = null)
    {
        var records = db.Records.ToList();

        if (artist != null)
            records = records.Where(r => r.Artist?.ToLower().Contains(artist.ToLower()) == true).ToList();

        if (available != null)
            records = records.Where(r => r.Available == available).ToList();

        var activeHires = db.Hires
            .Where(h => h.ReturnedAt == null)
            .ToList();

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("User-Agent", "SpinbackApi/1.0 (emailtestingpineapple@gmail.com)");

        foreach (var record in records)
        {
            var hire = activeHires.FirstOrDefault(h => h.RecordId == record.Id);
            record.HiredBy = hire?.FirstName ?? "Unknown";
            record.HiredAt = hire?.HiredAt ?? null;

            if (record.MbId != null) continue;

            var query = $"releasegroup:{record.Title} AND artist:{record.Artist}";
            var encoded = Uri.EscapeDataString(query);
            var url = $"https://musicbrainz.org/ws/2/release-group/?query={encoded}&fmt=json&limit=1";

            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode) continue;

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<MusicBrainzReleaseGroupResponse>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var match = result?.ReleaseGroups?.FirstOrDefault();
            if (match == null) continue;

            record.MbId = match.Id;

            await Task.Delay(1100);
        }

        db.SaveChanges();

        return records;
    }

    public static async Task<Record?> GetById(SpinbackDbContext db, int id)
    {
        var record = db.Records.FirstOrDefault(r => r.Id == id);

        if (record == null) return null;

        var hire = db.Hires.FirstOrDefault(h => h.RecordId == id && h.ReturnedAt == null);
        record.HiredBy = hire?.FirstName ?? "Unknown";
        record.HiredAt = hire?.HiredAt ?? null;

        if (record.MbId == null)
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("User-Agent", "SpinbackApi/1.0 (emailtestingpineapple@gmail.com)");

            var query = $"releasegroup:{record.Title} AND artist:{record.Artist}";
            var encoded = Uri.EscapeDataString(query);
            var url = $"https://musicbrainz.org/ws/2/release-group/?query={encoded}&fmt=json&limit=1";

            var response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<MusicBrainzReleaseGroupResponse>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                var match = result?.ReleaseGroups?.FirstOrDefault();
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
        var record = db.Records.FirstOrDefault(r => r.Id == recordId);

        if (record == null || !record.Available) return null;

        record.Available = false;

        var hire = new Hire
        {
            RecordId = recordId,
            FirstName = firstName,
            HiredAt = DateTime.UtcNow
        };

        db.Hires.Add(hire);
        db.SaveChanges();
        return hire;
    }

    public static bool ReturnRecord(SpinbackDbContext db, int recordId)
    {
        var hire = db.Hires
            .Include(h => h.Record)
            .Where(h => h.RecordId == recordId && h.ReturnedAt == null)
            .FirstOrDefault();

        if (hire == null) return false;

        hire.ReturnedAt = DateTime.UtcNow;
        hire.Record.Available = true;

        db.SaveChanges();
        return true;
    }

    public static DeleteRecordResponse DeleteRecord(SpinbackDbContext db, int recordId)
    {
        var record = db.Records.FirstOrDefault(r => r.Id == recordId);
        if (record == null) return new DeleteRecordResponse { Success = false, Message = "Record not found" };
        var activeHire = db.Hires.FirstOrDefault(h => h.RecordId == recordId && h.ReturnedAt == null);
        if (activeHire != null) return new DeleteRecordResponse { Success = false, Message = "Cannot delete a record that is currently hired out" };
        db.Records.Remove(record);
        db.SaveChanges();
        return new DeleteRecordResponse { Success = true, Message = "Record deleted successfully" };
    }
}