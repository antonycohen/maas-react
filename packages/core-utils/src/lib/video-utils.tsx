export const YOUTUBE_REGEX =
  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

export enum VideoPlatform {
  YOUTUBE = "youtube",
  UNKNOWN = "unknown",
}

export function detectPlatform(url: string): VideoPlatform {
  if (YOUTUBE_REGEX.test(url)) {
    return VideoPlatform.YOUTUBE;
  }

  return VideoPlatform.UNKNOWN;
}

export function getYouTubeVideoId(url: string) {
  if (!url) return null;

  const match = url.match(YOUTUBE_REGEX);

  return match && match[7].length === 11 ? match[7] : null;
}

export function getYoutubeIframe(
  videoId: string,
  width?: number | string,
  height?: number | string,
  className?: string,
) {
  return (
    <iframe
      className={className}
      width={width}
      height={height}
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export function getDefaultIframe(
  url: string,
  width?: number | string,
  height?: number | string,
  className?: string,
) {
  return (
    <iframe
      className={className}
      width={width}
      height={height}
      src={url}
      title="Video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export function getVideoIframe(
  url: string,
  width?: number | string,
  height?: number | string,
  className?: string,
) {
  const platform = detectPlatform(url);
  let videoId: string | null;
  switch (platform) {
    case VideoPlatform.YOUTUBE:
      videoId = getYouTubeVideoId(url);
      if (!videoId) return null;

      return getYoutubeIframe(videoId, width, height, className);
    default:
      return getDefaultIframe(url, width, height, className);
  }
}
