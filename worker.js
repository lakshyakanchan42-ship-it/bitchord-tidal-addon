const tracks = [
  {
    id: "test_track_001",
    title: "T-Rex Roar",
    artist: "MDN",
    album: "Test Audio",
    duration: 3,
    artworkURL: "https://developer.mozilla.org/favicon-192x192.png",
    format: "mp3",
    audioQuality: "HIGH",
    streamURL: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
  }
];

const MANIFEST = {
  id: "lakshya.bitchord.test",
  name: "Lakshya Test Addon",
  version: "1.0.0",
  resources: ["search", "stream"]
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Manifest
    if (url.pathname === "/manifest.json") {
      return json(MANIFEST);
    }

    // Search
    if (url.pathname === "/search") {
      const query = (url.searchParams.get("q") || "").toLowerCase();

      const results = tracks.filter((track) =>
        [track.title, track.artist, track.album]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );

      return json({
        tracks: results
      });
    }

    // Stream
    if (url.pathname.startsWith("/stream/")) {
      const id = decodeURIComponent(url.pathname.slice(8));

      const track = tracks.find((track) => track.id === id);

      if (!track) {
        return new Response(null, { status: 404 });
      }

      return json({
        url: track.streamURL,
        format: "mp3",
        quality: "High",
        codec: "mp3",
        container: "mp3",
        manifest: "none",
        encrypted: false
      });
    }

    return new Response("Not Found", { status: 404 });
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
