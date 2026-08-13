export type ButtonProps = {
  variant?: "primary" | "secondary";
  buttonLink: string;
  buttonTitle: string;
};

export default function Button({
  variant = "primary",
  buttonLink,
  buttonTitle,
}: ButtonProps) {
  const className =
    variant === "secondary"
      ? "inline-flex rounded-full border border-stone-500/50 px-5 py-3 text-sm font-semibold text-stone-100 transition-colors hover:border-stone-200 hover:bg-stone-100/10"
      : "inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(232,89,42,0.35)] transition-colors hover:bg-orange-500";

  return (
    <a
      href={buttonLink}
      className={className}
    >
      {buttonTitle}
    </a>
  );
}
