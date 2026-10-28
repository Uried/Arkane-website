import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ExternalLink,
  Loader2,
  Pause,
  Play,
  Search,
} from "lucide-react";
import { artists, type ArtistProfile } from "../data/artists";
import { siteConfig } from "../data/site";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import "./ArtistsPage.css";

/* --------------------------------------------------------------------------
 * Single shared audio element — guarantees one excerpt at a time.
 * All listeners live on the element and only ever write React state.
 * ------------------------------------------------------------------------ */

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

interface PlayerState {
  /** Artist id currently loaded into the audio element. */
  activeId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  /** Artist id whose last attempt failed (missing file, decode error…). */
  errorId: string | null;
  currentTime: number;
  duration: number;
}

const idlePlayer: PlayerState = {
  activeId: null,
  isPlaying: false,
  isLoading: false,
  errorId: null,
  currentTime: 0,
  duration: 0,
};

export default function ArtistsPage() {
  const scope = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [player, setPlayer] = useState<PlayerState>(idlePlayer);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = artists.filter((artist) =>
    normalize(artist.name).includes(normalize(query.trim())),
  );

  /* Page-level SEO — static meta in index.html stays the site default. */
  useEffect(() => {
    document.title = `Artistes — ${siteConfig.name}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        `${siteConfig.name} — artistes : ${artists.map((a) => a.name).join(", ")}.`,
      );
  }, []);

  /* Tear the audio element down with the page. */
  useEffect(
    () => () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
      audioRef.current = null;
    },
    [],
  );

  /* Close the platform menu on outside click or Escape. */
  useEffect(() => {
    if (!openMenuId) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest("[data-platforms-root]")) {
        setOpenMenuId(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenuId(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenuId]);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.addEventListener("timeupdate", () =>
        setPlayer((p) => ({ ...p, currentTime: audio.currentTime })),
      );
      audio.addEventListener("loadedmetadata", () =>
        setPlayer((p) => ({
          ...p,
          duration: Number.isFinite(audio.duration) ? audio.duration : 0,
        })),
      );
      audio.addEventListener("playing", () =>
        setPlayer((p) => ({ ...p, isPlaying: true, isLoading: false })),
      );
      audio.addEventListener("pause", () =>
        setPlayer((p) => ({ ...p, isPlaying: false })),
      );
      audio.addEventListener("waiting", () =>
        setPlayer((p) => ({ ...p, isLoading: true })),
      );
      audio.addEventListener("ended", () =>
        setPlayer((p) => ({ ...p, isPlaying: false, currentTime: 0 })),
      );
      audio.addEventListener("error", () =>
        setPlayer((p) => ({
          ...p,
          isPlaying: false,
          isLoading: false,
          errorId: audio.dataset.artistId ?? p.activeId,
        })),
      );
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const togglePlay = useCallback(
    (artist: ArtistProfile) => {
      if (!artist.excerptUrl) return;
      const audio = getAudio();

      if (player.activeId === artist.id) {
        if (player.isPlaying) {
          audio.pause();
        } else {
          void audio
            .play()
            .catch(() =>
              setPlayer((p) => ({ ...p, errorId: artist.id, isLoading: false })),
            );
        }
        return;
      }

      audio.pause();
      audio.src = artist.excerptUrl;
      audio.dataset.artistId = artist.id;
      setPlayer({
        activeId: artist.id,
        isPlaying: false,
        isLoading: true,
        errorId: null,
        currentTime: 0,
        duration: 0,
      });
      void audio.play().catch(() =>
        setPlayer((p) => ({ ...p, errorId: artist.id, isLoading: false })),
      );
    },
    [getAudio, player.activeId, player.isPlaying],
  );

  const seek = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = seconds;
      setPlayer((p) => ({ ...p, currentTime: seconds }));
    },
    [],
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          /* Hero — title chars rise behind their mask, rule draws, meta fades. */
          const intro = gsap.timeline({
            defaults: { duration: 0.7, ease: "power3.out" },
          });
          intro
            .from(".artists-hero__char", { yPercent: 110, stagger: 0.045 })
            .from(
              ".artists-hero__rule",
              { scaleX: 0, duration: 0.6, ease: "power2.inOut" },
              "-=0.35",
            )
            .from(
              ".artists-hero__meta > *",
              { autoAlpha: 0, y: 12, duration: 0.45, stagger: 0.08 },
              "-=0.25",
            );

          /* Catalog — one staggered entrance when the grid scrolls in. */
          gsap.fromTo(
            ".artist-tile",
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              stagger: 0.06,
              scrollTrigger: {
                trigger: ".artists__grid",
                start: "top 88%",
                once: true,
              },
            },
          );

          /* Re-measure trigger positions once webfonts settle the layout. */
          document.fonts?.ready.then(() => ScrollTrigger.refresh());
        },
        scope,
      );

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope}>
      {/* ---------------------------------------------------------- Hero */}
      <section className="artists-hero" aria-labelledby="artists-title">
        <div className="artists-hero__inner container">
          <p className="label label--accent artists-hero__eyebrow">
            {siteConfig.name}
          </p>

          <h1 id="artists-title" className="artists-hero__title">
            <span className="artists-hero__title-mask" aria-hidden="true">
              {"Artistes".split("").map((char, i) => (
                <span key={i} className="artists-hero__char">
                  {char}
                </span>
              ))}
            </span>
            <span className="visually-hidden">Artistes</span>
          </h1>

          <div className="artists-hero__meta">
            <span className="artists-hero__rule" aria-hidden="true" />
            <span className="label">Roster</span>
            <span className="label artists-hero__count">
              {String(artists.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Catalog */}
      <section className="artists" aria-label="Catalogue des artistes">
        <div className="artists__inner container">
          <div className="artists__toolbar">
            <label className="artists__filter">
              <Search size={14} aria-hidden="true" />
              <span className="visually-hidden">Rechercher un artiste</span>
              <input
                className="artists__filter-input"
                type="search"
                placeholder="Rechercher"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {query.trim() && (
              <p className="label artists__count" role="status">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="label artists__empty">
              Aucun artiste ne correspond à cette recherche.
            </p>
          ) : (
            <ol className="artists__grid" role="list">
              {filtered.map((artist) => (
                <ArtistTile
                  key={artist.id}
                  artist={artist}
                  player={player}
                  menuOpen={openMenuId === artist.id}
                  onTogglePlay={() => togglePlay(artist)}
                  onToggleMenu={() =>
                    setOpenMenuId((id) => (id === artist.id ? null : artist.id))
                  }
                  onSeek={seek}
                />
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * One catalog tile: portrait, name, excerpt control, platform menu.
 * ------------------------------------------------------------------------ */

interface ArtistTileProps {
  artist: ArtistProfile;
  player: PlayerState;
  menuOpen: boolean;
  onTogglePlay: () => void;
  onToggleMenu: () => void;
  onSeek: (seconds: number) => void;
}

function ArtistTile({
  artist,
  player,
  menuOpen,
  onTogglePlay,
  onToggleMenu,
  onSeek,
}: ArtistTileProps) {
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const isActive = player.activeId === artist.id;
  const isPlaying = isActive && player.isPlaying;
  const isLoading = isActive && player.isLoading;
  const hasError = player.errorId === artist.id;
  const hasExcerpt = Boolean(artist.excerptUrl);

  /* Menu entrance — quick fade/rise, killed on close. */
  useEffect(() => {
    const panel = menuPanelRef.current;
    if (!menuOpen || !panel) return;
    const tween = gsap.fromTo(
      panel,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.18, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [menuOpen]);

  const playLabel = !hasExcerpt
    ? `Aucun extrait disponible pour ${artist.name}`
    : isPlaying
      ? `Mettre en pause l'extrait de ${artist.name}`
      : `Lire un extrait de ${artist.name}`;

  return (
    <li
      className={`artist-tile${isPlaying ? " artist-tile--playing" : ""}`}
      data-platforms-root
    >
      <div className="artist-tile__media">
        <img
          className="artist-tile__img"
          src={artist.imageUrl}
          alt={artist.imageAlt}
          loading="lazy"
          decoding="async"
          style={
            {
              "--artist-object": artist.imagePosition ?? "50% 40%",
            } as CSSProperties
          }
        />
        <button
          type="button"
          className="artist-tile__play"
          onClick={onTogglePlay}
          disabled={!hasExcerpt}
          aria-label={playLabel}
          title={hasExcerpt ? undefined : "Extrait à venir"}
        >
          {isLoading ? (
            <Loader2 className="artist-tile__spinner" size={18} aria-hidden="true" />
          ) : isPlaying ? (
            <Pause size={18} aria-hidden="true" />
          ) : (
            <Play size={18} aria-hidden="true" />
          )}
        </button>
        <span className="artist-tile__eq" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        {isPlaying && (
          <span className="visually-hidden" role="status">
            Lecture en cours — {artist.name}
          </span>
        )}
      </div>

      <div className="artist-tile__body">
        <div className="artist-tile__row">
          <h2 className="artist-tile__name">{artist.name}</h2>
          <button
            type="button"
            className="artist-tile__listen"
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            Écouter
          </button>
        </div>

        {!hasExcerpt && !hasError && (
          <p className="artist-tile__status">Extrait à venir</p>
        )}
        {hasError && (
          <p className="artist-tile__status artist-tile__status--error">
            Lecture impossible pour le moment
          </p>
        )}

        {isActive && player.duration > 0 && (
          <input
            className="artist-tile__progress"
            type="range"
            min={0}
            max={player.duration}
            step={0.01}
            value={Math.min(player.currentTime, player.duration)}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-label={`Progression de l'extrait de ${artist.name}`}
          />
        )}

        {menuOpen && (
          <div className="artist-tile__menu" role="menu" ref={menuPanelRef}>
            {artist.platforms.length === 0 ? (
              <p className="artist-tile__menu-empty">
                Aucune plateforme renseignée pour le moment.
              </p>
            ) : (
              <ul role="list">
                {artist.platforms.map((platform) => (
                  <li key={platform.label}>
                    <a
                      className="artist-tile__platform"
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                    >
                      {platform.label}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
