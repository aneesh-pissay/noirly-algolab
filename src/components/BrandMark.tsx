import { cn } from "@noirly-dev/ui";

/**
 * The AlgoLab mark, inlined so it takes the active accent (`currentColor`
 * under `.brand-mark`) in every palette and both schemes. Same shapes as
 * public/brand-mark.svg.
 */
/** Pass `name=""` when a visible wordmark sits next to it. */
export function BrandMark({ name = "Noirly AlgoLab", className }: { name?: string; className?: string }) {
  return (
    <span
      className={cn("brand-mark h-9 w-9", className)}
      {...(name ? { role: "img", "aria-label": name } : { "aria-hidden": true })}
    >
      <svg viewBox="0 0 1024 1024" aria-hidden focusable="false">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path strokeWidth="44" d="M380 214 H644" />
          <path
            strokeWidth="44"
            d="M424 214 V404 L250 694 Q224 740 254 764 Q274 780 314 780 H710 Q750 780 770 764 Q800 740 774 694 L600 404 V214"
          />
          <path strokeWidth="30" d="M366 620 L330 662 L366 704" />
          <path strokeWidth="30" d="M658 620 L694 662 L658 704" />
          <path strokeWidth="24" d="M434 676 L482 580 L542 676 L590 580" />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="22">
          <circle cx="434" cy="676" r="22" />
          <circle cx="482" cy="580" r="22" />
          <circle cx="542" cy="676" r="22" />
          <circle cx="590" cy="580" r="22" />
        </g>
      </svg>
    </span>
  );
}
