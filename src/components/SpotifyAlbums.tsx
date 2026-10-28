import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { spotifyAlbums } from "../data/albums";
import Reveal from "./Reveal";
import "./SpotifyAlbums.css";

/**
 * Compact album shelf — each entry keeps a cover row and expands into the
 * official Spotify embed on demand. One player open at a time.
 */
export default function SpotifyAlbums() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="albums" aria-labelledby="albums-heading">
      <div className="albums__inner container">
        <Reveal>
          <h2 id="albums-heading" className="label albums__label">
            Albums
          </h2>
        </Reveal>

        <ul className="albums__list" role="list">
          {spotifyAlbums.map((album, i) => {
            const open = openId === album.id;
            return (
              <li key={album.id} className="album">
                <Reveal delay={i * 100}>
                  <div className="album__bar">
                    <img
                      className="album__cover"
                      src={album.coverUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="album__meta">
                      <p className="album__title">{album.title}</p>
                      {album.artist && (
                        <p className="album__artist label">{album.artist}</p>
                      )}
                    </div>
                    <a
                      className="album__spotify label"
                      href={album.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ouvrir ${album.title} sur Spotify`}
                    >
                      Spotify
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      className="album__toggle"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : album.id)}
                    >
                      {open ? "Réduire" : "Lecteur"}
                      <ChevronDown
                        className={`album__chevron${open ? " album__chevron--open" : ""}`}
                        size={14}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Reveal>
                {open && (
                  <div className="album__player">
                    <iframe
                      src={album.embedUrl}
                      title={`Lecteur Spotify — ${album.title}`}
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
