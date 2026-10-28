import markUrl from "../assets/brand/arkane-mark.png";
import lockupUrl from "../assets/brand/arkane-lockup.png";
import "./Logo.css";

interface LogoProps {
  /** "mark" = dome glyph only, "lockup" = glyph + ARKANE wordmark. */
  variant?: "mark" | "lockup";
  className?: string;
}

export default function Logo({ variant = "mark", className = "" }: LogoProps) {
  return (
    <img
      className={`logo logo--${variant} ${className}`.trim()}
      src={variant === "mark" ? markUrl : lockupUrl}
      alt="Arkane Production"
      width={variant === "mark" ? 167 : 167}
      height={variant === "mark" ? 100 : 125}
    />
  );
}
