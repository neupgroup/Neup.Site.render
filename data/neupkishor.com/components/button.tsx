export type ButtonProps = {
  buttonLink: string;
  buttonTitle: string;
};

export default function Button({ buttonLink, buttonTitle }: ButtonProps) {
  return (
    <a
      href={buttonLink}
      className="inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
    >
      {buttonTitle}
    </a>
  );
}
