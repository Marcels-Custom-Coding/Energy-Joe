import { asset } from "./assets";

// @font-face rules only work in the document, not inside shadow roots.
// Own family names avoid clashes with fonts a user may have installed.
const FACES: [family: string, weight: number, style: string, file: string][] = [
  ["Energy Joe Barlow", 400, "normal", "barlow-latin-400-normal"],
  ["Energy Joe Barlow", 500, "normal", "barlow-latin-500-normal"],
  ["Energy Joe Barlow", 600, "normal", "barlow-latin-600-normal"],
  ["Energy Joe Barlow", 700, "normal", "barlow-latin-700-normal"],
  ["Energy Joe Barlow Condensed", 700, "normal", "barlow-condensed-latin-700-normal"],
  ["Energy Joe Barlow Condensed", 700, "italic", "barlow-condensed-latin-700-italic"],
  ["Energy Joe Barlow Condensed", 800, "italic", "barlow-condensed-latin-800-italic"],
];

export function ensureFonts(): void {
  if (document.getElementById("energy-joe-fonts")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "energy-joe-fonts";
  style.textContent = FACES.map(
    ([family, weight, fontStyle, file]) =>
      `@font-face{font-family:"${family}";font-style:${fontStyle};font-weight:${weight};font-display:swap;src:url("${asset(`fonts/${file}.woff2`)}") format("woff2")}`,
  ).join("\n");
  document.head.appendChild(style);
}
