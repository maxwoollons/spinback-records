using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SpinbackApi.Models
{
    public class MusicBrainzReleaseGroupResponse
    {
        [JsonPropertyName("release-groups")]
        public List<MusicBrainzReleaseGroup> ReleaseGroups { get; set; }
    }

    public class MusicBrainzReleaseGroup
    {
        public string Id { get; set; }
        public string Title { get; set; }
    }
}
