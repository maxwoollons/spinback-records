using SpinbackApi.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpinbackApi.Data
{
    public static class RecordStore
    {
        public static List<Record> Records = new List<Record>
    {
        new Record { Id = 1, Title = "Rumours", Artist = "Fleetwood Mac", Available = true },
        new Record { Id = 2, Title = "Kind of Blue", Artist = "Miles Davis", Available = true },
        new Record { Id = 3, Title = "Back in Black", Artist = "AC/DC", Available = false },
        new Record { Id = 4, Title = "Thriller", Artist = "Michael Jackson", Available = true },
        new Record { Id = 5, Title = "The Dark Side of the Moon", Artist = "Pink Floyd", Available = true }
    };
    }
}
