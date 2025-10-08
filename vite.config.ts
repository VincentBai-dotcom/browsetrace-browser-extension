import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        "worker/index": "src/worker/index.ts",
        "content/index": "src/content/index.ts",
        "popup/index": "src/popup/index.tsx",
      },
      output: {
        entryFileNames: (a: { name: string }) =>
          a.name.replace(/\/index$/, "") + ".js",
      },
    },
    target: "es2022",
    sourcemap: true,
  },
  publicDir: "public",
});
