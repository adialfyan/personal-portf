import Image from "next/image";
import type { ReactNode } from "react";

interface ProjectFrameProps {
  src: string;
  alt: string;
  /** Address shown in the frame bar — a real hostname or a plain status. */
  label: string;
  footer?: ReactNode;
  priority?: boolean;
}

const WINDOW_CONTROLS = (
  <svg
    width="36"
    height="8"
    viewBox="0 0 36 8"
    fill="none"
    aria-hidden="true"
    className="shrink-0 text-neutral-300"
  >
    <circle cx="4" cy="4" r="3.5" fill="currentColor" />
    <circle cx="18" cy="4" r="3.5" fill="currentColor" />
    <circle cx="32" cy="4" r="3.5" fill="currentColor" />
  </svg>
);

/**
 * Presents a product screenshot inside a minimal browser frame so every
 * project image reads as one consistent plate.
 */
export function ProjectFrame({
  src,
  alt,
  label,
  footer,
  priority = false,
}: ProjectFrameProps) {
  return (
    <div className="group relative overflow-hidden border border-border bg-[#fafafa]">
      <div className="flex items-center gap-3 border-b border-border bg-white px-3 py-2 sm:px-4">
        {WINDOW_CONTROLS}
        <span className="min-w-0 flex-1 truncate text-center text-[10px] font-medium tracking-[0.16em] uppercase text-muted">
          {label}
        </span>
        <span aria-hidden="true" className="w-9 shrink-0" />
      </div>
      <div className="relative w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={1800}
          height={1125}
          className="h-auto w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.012]"
          sizes="(max-width: 1440px) 100vw, 1440px"
          priority={priority}
        />
      </div>
      {footer}
    </div>
  );
}
