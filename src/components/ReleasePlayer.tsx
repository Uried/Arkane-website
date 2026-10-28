import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2, Pause, Play } from "lucide-react";
import {
  loadSpotifyApi,
  type SpotifyEmbedController,
} from "../lib/spotify-embed";

/* Registry across all players — one excerpt playing at a time. */
const controllers = new Map<string, SpotifyEmbedController>();

function pauseOthers(except: string) {
  controllers.forEach((controller, id) => {
    if (id !== except) controller.pause();
  });
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

interface ReleasePlayerProps {
  /** Unique key for the shared-player registry. */
  id: string;
  title: string;
  /** spotify:album:… URI — the playable source wired today. */
  spotifyUri?: string;
  /** External platforms link (smart link or album page). */
  listenUrl?: string;
}

/**
 * Integrated excerpt player driven by the official Spotify iFrame API.
 * First click loads the API and mounts the compact embed in the drawer
 * below the card; our button then stays in sync through playback_update.
 */
export default function ReleasePlayer({
  id,
  title,
  spotifyUri,
  listenUrl,
}: ReleasePlayerProps) {
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [isPaused, setIsPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(
    () => () => {
      controllers.delete(id);
      controllerRef.current?.destroy?.();
      controllerRef.current = null;
    },
    [id],
  );

  const toggle = useCallback(async () => {
    const existing = controllerRef.current;
    if (existing) {
      existing.togglePlay();
      return;
    }
    if (!spotifyUri || !embedRef.current) return;

    setPhase("loading");
    try {
      const api = await loadSpotifyApi();
      api.createController(
        embedRef.current,
        { uri: spotifyUri, width: "100%", height: 152 },
        (controller) => {
          controllerRef.current = controller;
          controllers.set(id, controller);
          controller.addListener("playback_update", (event) => {
            setIsPaused(event.data.isPaused);
            setPosition(event.data.position);
            setDuration(event.data.duration);
            /* Covers playback started from inside the embed too. */
            if (!event.data.isPaused) pauseOthers(id);
          });
          setPhase("ready");
          pauseOthers(id);
          controller.play();
        },
      );
    } catch {
      setPhase("error");
    }
  }, [id, spotifyUri]);

  const isActive = phase === "ready";
  const isPlaying = isActive && !isPaused;
  const hasSource = Boolean(spotifyUri);
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  const toggleLabel = !hasSource
    ? `Aucun extrait disponible pour ${title}`
    : isPlaying
      ? `Mettre en pause l'extrait de ${title}`
      : `Lire un extrait de ${title}`;

  return (
    <div className="release-player">
      <div className="release-player__controls">
        <button
          type="button"
          className="release-player__toggle"
          onClick={toggle}
          disabled={!hasSource}
          aria-label={toggleLabel}
          title={hasSource ? undefined : "Extrait à venir"}
        >
          {phase === "loading" ? (
            <Loader2
              className="release-player__spinner"
              size={15}
              aria-hidden="true"
            />
          ) : isPlaying ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
        </button>

        <div className="release-player__track">
          <div
            className="release-player__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={duration || 1}
            aria-valuenow={position}
            aria-label={`Progression de l'extrait de ${title}`}
          >
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
          {isActive && duration > 0 && (
            <span className="release-player__time">
              {formatTime(position)} / {formatTime(duration)}
            </span>
          )}
          {phase === "error" && (
            <span className="release-player__status release-player__status--error">
              Lecture impossible
            </span>
          )}
          {!hasSource && phase !== "error" && (
            <span className="release-player__status">Extrait à venir</span>
          )}
        </div>

        {listenUrl && (
          <a
            className="release-player__open"
            href={listenUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ouvrir ${title} sur les plateformes d'écoute`}
          >
            Ouvrir
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        )}
      </div>

      <div
        className={`release-player__embed${isActive ? " release-player__embed--open" : ""}`}
      >
        <div ref={embedRef} className="release-player__slot" />
      </div>
    </div>
  );
}
