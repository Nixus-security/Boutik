import type { CSSProperties, ReactNode } from "react";

export function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  children,
  duration = "30s",
}: {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: ReactNode;
  duration?: string;
}) {
  return (
    <div
      className={["group flex overflow-hidden gap-4 py-2", className].join(" ")}
      style={{ "--duration": duration } as CSSProperties}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={[
            "flex shrink-0 items-stretch gap-4 animate-marquee motion-reduce:animate-none",
            reverse ? "[animation-direction:reverse]" : "",
            pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
          ].join(" ")}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
