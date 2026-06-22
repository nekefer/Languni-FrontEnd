const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const normalizeCandidate = (value) => {
  if (!value) return "";
  return value.trim().split(/[?&#/]/)[0];
};

export const extractYouTubeVideoId = (input) => {
  const value = input?.trim();
  if (!value) return null;

  if (YOUTUBE_ID_PATTERN.test(value)) {
    return value;
  }

  let url;
  try {
    url = new URL(value.includes("://") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  let candidate = "";

  if (hostname === "youtu.be") {
    candidate = url.pathname.split("/").filter(Boolean)[0] || "";
  } else if (
    hostname === "youtube.com" ||
    hostname === "m.youtube.com" ||
    hostname === "music.youtube.com" ||
    hostname === "youtube-nocookie.com"
  ) {
    candidate = url.searchParams.get("v") || "";

    if (!candidate) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (["shorts", "embed", "live", "v"].includes(parts[0])) {
        candidate = parts[1] || "";
      }
    }
  }

  const normalized = normalizeCandidate(candidate);
  return YOUTUBE_ID_PATTERN.test(normalized) ? normalized : null;
};

export const getYouTubeThumbnail = (videoId) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
