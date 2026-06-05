using System;
using System.Collections.Generic;
using System.Text;

namespace SpinbackApi.Models
{
    namespace SpinbackApi.Models
    {
        public class Hire
        {
            public int Id { get; set; }
            public int RecordId { get; set; }
            public string FirstName { get; set; }
            public DateTime HiredAt { get; set; }
            public DateTime? ReturnedAt { get; set; }

            public Record Record { get; set; }
        }
    }
}
