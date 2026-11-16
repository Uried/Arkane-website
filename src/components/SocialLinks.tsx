import { socialLinks } from "../data/socialLinks";
import "./SocialLinks.css";

/**
 * Arkane social presence — driven by src/data/socialLinks.ts.
 * Platforms with a confirmed account render as external links;
 * the others stay plain logos, with no link at all.
 */
export default function SocialLinks() {
  return (
    <ul className="social-links">
      {socialLinks.map((social) => (
        <li key={social.id} className="social-links__item">
          {social.clickable && social.url ? (
            <a
              className="social-links__link"
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              title={social.name}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={social.icon} fill="currentColor" />
              </svg>
            </a>
          ) : (
            <span
              className="social-links__link social-links__link--static"
              role="img"
              aria-label={social.name}
              title={social.name}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={social.icon} fill="currentColor" />
              </svg>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
