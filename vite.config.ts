import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        "worker/index": "src/worker/index.ts",
        "content/index": "src/content/index.ts",
        "popup/index": "src/popup/index.ts",
      },
      output: {
        entryFileNames: (a) => a.name.replace(/\/index$/, "") + ".js",
      },
    },
    target: "es2022",
    sourcemap: true,
  },
  publicDir: "public",
});
