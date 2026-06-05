using System;
using System.Collections.Generic;
using System.Text;

namespace SpinbackApi.Models
{
    public class DeleteRecordResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
