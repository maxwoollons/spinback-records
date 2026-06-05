using SpinbackApi.Data;
using SpinbackApi.Models;
using SpinbackApi.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace SpinbackApi.Services
{
    public static class RecordService
    {
        public static Record? GetById(int id)
        {
            return RecordStore.Records.FirstOrDefault(r => r.Id == id);
        }

        public static List<Record> GetAll()
        {
            return RecordStore.Records;
        }
    }
}
