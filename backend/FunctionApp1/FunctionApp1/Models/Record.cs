using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpinbackApi.Models
{
    public class Record
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Artist { get; set; }
        public bool Available { get; set; }
        public string? MbId { get; set; }

        [NotMapped]
        public int? Duration { get; set; }
        [NotMapped]
        public string? HiredBy { get; set; }
        [NotMapped]
        public DateTime? HiredAt { get; set; }

    }
}
