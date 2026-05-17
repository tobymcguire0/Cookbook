import { cn } from "../lib/cn";

type SaucerLoaderProps = {
  label?: string;
  variant?: "splash" | "overlay";
};

function SaucerMark() {
  return (
    <div className="saucer-loader-mark">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3C8.5 3 5.5 5 4 8H20C18.5 5 15.5 3 12 3Z" />
        <path d="M3.5 10C3.2 11.3 3 12 3 13C3 18 7 21 12 21C17 21 21 18 21 13C21 12 20.8 11.3 20.5 10H3.5Z" opacity=".5" />
        <path d="M8 14C8 14 9 16 12 16C15 16 16 14 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export default function SaucerLoader({ label = "Loading…", variant = "splash" }: SaucerLoaderProps) {
  const body = (
    <div className={cn("saucer-loader", variant === "overlay" && "saucer-loader-card")}>
      <SaucerMark />
      <span className="saucer-loader-name">Saucer</span>
      <span className="saucer-loader-label">{label}</span>
      <div className="saucer-loader-dots" aria-hidden="true">
        <span className="saucer-loader-dot" />
        <span className="saucer-loader-dot" />
        <span className="saucer-loader-dot" />
      </div>
    </div>
  );

  return (
    <div
      className={variant === "overlay" ? "saucer-loader-overlay" : "saucer-loader-splash"}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {body}
    </div>
  );
}
