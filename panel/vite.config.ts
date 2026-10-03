import { defineConfig } from "vite";

// Builds one self-contained ES module that the integration serves as its panel.
// Files in panel/public (logo, images) are copied next to it.
export default defineConfig({
  build: {
    lib: {
      entry: "src/energy-joe-panel.ts",
      formats: ["es"],
      fileName: () => "energy-joe-panel.js",
    },
    outDir: "../custom_components/energy_joe/frontend",
    emptyOutDir: true,
    target: "es2022",
    sourcemap: false,
  },
});
