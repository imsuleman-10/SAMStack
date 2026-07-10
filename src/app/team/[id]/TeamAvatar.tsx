"use client";

interface TeamAvatarProps {
  src: string;
  name: string;
  className?: string;
  wrapperClassName?: string;
}

/** Small client component purely to handle the onError fallback on <img> */
export function TeamAvatar({ src, name, className, wrapperClassName }: TeamAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className={wrapperClassName ?? "mx-auto w-28 h-28 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-gradient-to-br from-brand-500/30 to-indigo-500/20 flex items-center justify-center"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} profile photo`}
        className={className ?? "w-full h-full object-cover"}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.querySelector("[data-fallback]")) {
            const span = document.createElement("span");
            span.setAttribute("data-fallback", "1");
            span.className = "text-4xl font-black text-brand-600 dark:text-brand-400";
            span.textContent = initial;
            parent.appendChild(span);
          }
        }}
      />
    </div>
  );
}

/** Compact avatar for the "More team members" grid */
export function TeamAvatarSmall({ src, name }: { src: string; name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 bg-gradient-to-br from-brand-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.querySelector("[data-fallback]")) {
            const span = document.createElement("span");
            span.setAttribute("data-fallback", "1");
            span.className = "text-sm font-black text-brand-600 dark:text-brand-400";
            span.textContent = initial;
            parent.appendChild(span);
          }
        }}
      />
    </div>
  );
}
