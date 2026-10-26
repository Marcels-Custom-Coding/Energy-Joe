import { defineConfig, type Plugin } from "vite";
import { version } from "./package.json";
import { de } from "./src/i18n/de.ts";

/** Joe's German sentences that the second look reads along (sparring in the backend); no tooltips. */
const TEXT_PREFIXES = ["plan.", "overview.", "need.", "surplus.", "sum.", "past.", "guard.", "team.", "rule."];

/** Writes texts-de.json next to the panel: a flat {key: template} with the placeholders kept. */
function textsFile(): Plugin {
  return {
    name: "joe-texts-de",
    generateBundle() {
      const texts = Object.fromEntries(
        Object.entries(de as Record<string, string>).filter(([key]) => TEXT_PREFIXES.some((prefix) => key.startsWith(prefix))),
      );
      this.emitFile({ type: "asset", fileName: "texts-de.json", source: `${JSON.stringify(texts, null, 1)}\n` });
    },
  };
}

// Builds one self-contained ES module that the integration serves as its panel.
// Files in panel/public (logo, images) are copied next to it.
export default defineConfig({
  // The panel compares it with an already loaded one (src/define.ts).
  define: { __JOE_VERSION__: JSON.stringify(version) },
  plugins: [textsFile()],
  build: {
    lib: {
      entry: {
        "energy-joe-panel": "src/energy-joe-panel.ts",
        "energy-joe-icons": "src/energy-joe-icons.ts",
        "energy-joe-cards": "src/energy-joe-cards.ts",
      },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
    outDir: "../custom_components/energy_joe/frontend",
    emptyOutDir: true,
    target: "es2022",
    sourcemap: false,
  },
});
