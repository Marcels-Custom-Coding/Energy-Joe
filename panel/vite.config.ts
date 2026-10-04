import { defineConfig } from "vite";
import { version } from "./package.json";

// Builds one self-contained ES module that the integration serves as its panel.
// Files in panel/public (logo, images) are copied next to it.
export default defineConfig({
  // The panel compares it with an already loaded one (src/define.ts).
  define: { __JOE_VERSION__: JSON.stringify(version) },
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
