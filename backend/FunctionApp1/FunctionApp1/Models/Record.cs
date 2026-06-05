using System;
using System.Collections.Generic;
using System.Text;

namespace SpinbackApi.Models
{
    public class Record
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Artist { get; set; }
        public bool Available { get; set; }
    }
}
