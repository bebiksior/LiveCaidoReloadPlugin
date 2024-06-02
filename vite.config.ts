import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import zipPack from "vite-plugin-zip-pack";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "../",
        },
      ],
    }),
    zipPack({
      outFileName: "plugin.zip",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "livecaidoreload-plugin",
      fileName: (format) => "script.js",
      formats: ["es"],
    },
    outDir: "dist/frontend",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
