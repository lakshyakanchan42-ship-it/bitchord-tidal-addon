const tracks = [
  {
    id: "track_8f31",
    title: "Midnight Signal",
    artist: "Example Artist",
    album: "Night Drive",
    duration: 242,
    artworkURL: "https://developer.mozilla.org/favicon-192x192.png",
    format: "flac",
    audioQuality: "LOSSLESS"
  }
];

const MANIFEST = {
  id: "lakshya.bitchord.test",
  name: "Lakshya FLAC Test Addon",
  version: "1.0.0",
  resources: ["search", "stream"],
  settings: [
    {
      key: "quality",
      type: "select",
      default: "lossless",
      options: [
        {
          label: "Lossless",
          value: "lossless"
        },
        {
          label: "High",
          value: "high"
        },
        {
          label: "Low",
          value: "low"
        }
      ]
    }
  ]
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/manifest.json") {
      return json(MANIFEST);
    }

    if (url.pathname === "/search") {
      const query = (url.searchParams.get("q") || "").toLowerCase();

      return json({
        tracks: tracks.filter((track) =>
          [track.title, track.artist, track.album]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
      });
    }

    if (url.pathname.startsWith("/stream/")) {
      const id = decodeURIComponent(url.pathname.slice(8));

      const track = tracks.find((track) => track.id === id);

      if (!track) {
        return new Response(null, { status: 404 });
      }

      return json({
        url: "https://pnb-website-bucket.s3.us-east-2.amazonaws.com/samples/audio/flac/sample-audio-10s.flac",
        format: "flac",
        quality: "Lossless · 16-bit / 44.1 kHz",
        codec: "flac",
        container: "flac",
        manifest: "none",
        encrypted: false,
        sampleRate: 44100,
        bitDepth: 16,
        bitrate: 278000
      });
    }

    return new Response(null, { status: 404 });
  }
};

function json(value) {
  return new Response(JSON.stringify(value), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
