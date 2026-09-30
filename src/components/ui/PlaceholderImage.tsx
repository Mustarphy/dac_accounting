import { ImageIcon } from "lucide-react";

type PlaceholderImageProps = {
  label: string;
  className?: string;
};

/**
 * Temporary stand-in for a real photograph. DAC has not yet supplied
 * final imagery, so this renders a clearly-marked placeholder instead of
 * a broken or stock-photo image path.
 *
 * To replace: drop a photo into /public/images/... and swap this
 * component for a `next/image` element with the same className,
 * explicit width/height (or `fill`), and descriptive alt text.
 */
export default function PlaceholderImage({ label, className = "" }: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary-light p-6 text-center ${className}`}
    >
      <ImageIcon className="size-8 text-primary/60" aria-hidden="true" />
      <p className="text-sm font-medium text-primary-dark/70">{label}</p>
    </div>
  );
}
