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
      ? "inline-flex items-center justify-center border border-[#c8a968]/55 px-5 py-3 text-sm font-semibold uppercase text-[#f5ead5] transition-colors hover:border-[#f3d58d] hover:bg-[#f3d58d]/10"
      : "inline-flex items-center justify-center bg-[#c8a968] px-5 py-3 text-sm font-semibold uppercase text-[#07171a] shadow-[0_18px_50px_rgba(200,169,104,0.28)] transition-colors hover:bg-[#f3d58d]";

  return (
    <a href={buttonLink} className={className}>
      {buttonTitle}
    </a>
  );
}
