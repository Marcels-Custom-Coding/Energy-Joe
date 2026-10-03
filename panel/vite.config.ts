import { defineConfig } from "vite";

// Builds one self-contained ES module that the integration serves as its panel.
// Files in panel/public (logo, images) are copied next to it.
export default defineConfig({
  build: {
    lib: {
      entry: {
        "energy-joe-panel": "src/energy-joe-panel.ts",
        "energy-joe-icons": "src/energy-joe-icons.ts",
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
