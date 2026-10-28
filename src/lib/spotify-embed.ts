/**
 * Official Spotify iFrame API — loads `embed/iframe-api/v1` once and exposes
 * a typed promise. The API renders the real Spotify player and lets our own
 * controls drive it (play/pause/seek) with live position + duration updates.
 */

export interface SpotifyPlaybackUpdate {
  data: {
    isPaused: boolean;
    /** Milliseconds. */
    position: number;
    /** Milliseconds. */
    duration: number;
  };
}

export interface SpotifyEmbedController {
  play(): void;
  pause(): void;
  togglePlay(): void;
  loadUri(uri: string): void;
  seek?(seconds: number): void;
  destroy?(): void;
  addListener(
    event: "ready" | "playback_update" | "playback_started",
    callback: (event: SpotifyPlaybackUpdate) => void,
  ): void;
  removeListener?(
    event: string,
    callback: (event: SpotifyPlaybackUpdate) => void,
  ): void;
}

export interface SpotifyIFrameApi {
  createController(
    element: HTMLElement,
    options: { uri: string; width: string; height: number },
    callback: (controller: SpotifyEmbedController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
  }
}

const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

let apiPromise: Promise<SpotifyIFrameApi> | null = null;

export function loadSpotifyApi(): Promise<SpotifyIFrameApi> {
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = resolve;
      const script = document.createElement("script");
      script.src = API_SRC;
      script.async = true;
      script.onerror = () => {
        apiPromise = null;
        reject(new Error("Spotify iFrame API failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}
