const tracks = [
  {
    id: "track_8f31",
    title: "Midnight Signal",
    artist: "Example Artist",
    album: "Night Drive",
    duration: 242,
    artworkURL: "https://audio.example/art/8f31.jpg",
    format: "flac",
    audioQuality: "LOSSLESS"
  }
]

const MANIFEST = {
  id: "lakshya.bitchord.test",
  name: "Lakshya FLAC Test Addon",
  version: "1.0.0",
  resources: ["search", "stream"]
}

export default {
  async fetch(request) {
    return handleRequest(request)
  }
}

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === "/manifest.json") {
    return json(MANIFEST)
  }

  if (url.pathname === "/search") {
    const query = (url.searchParams.get("q") || "").toLowerCase()

    return json({
      tracks: tracks.filter((track) =>
        [track.title, track.artist, track.album]
          .join(" ").toLowerCase().includes(query)
      )
    })
  }

  if (url.pathname.startsWith("/stream/")) {
    const id = decodeURIComponent(url.pathname.slice(8))

    if (!tracks.some((track) => track.id === id)) {
      return new Response(null, { status: 404 })
    }

    return json({
      url: signedMediaUrl(id),
      codec: "flac",
      container: "flac",
      manifest: "none",
      encrypted: false,
      sampleRate: 96000,
      bitDepth: 24
    })
  }

  return new Response(null, { status: 404 })
}

function json(value) {
  return Response.json(value, {
    headers: { "Cache-Control": "no-store" }
  })
}

function signedMediaUrl(id) {
  return "https://pnb-website-bucket.s3.us-east-2.amazonaws.com/samples/audio/flac/sample-audio-10s.flac"
    }
