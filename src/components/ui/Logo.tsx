import Image from "next/image";

type LogoProps = {
  /** Set to true when rendered on a dark background — wraps in a white pill */
  onDark?: boolean;
  className?: string;
};

export default function Logo({ onDark = false, className }: LogoProps) {
  return (
    <span className={onDark ? `inline-flex rounded-lg bg-white px-2 py-1 ${className ?? ""}` : className}>
      <Image
        src="/images/logo.png"
        alt="OAC Accounting"
        width={240}
        height={72}
        className="h-12 w-auto"
        priority
      />
    </span>
  );
}
