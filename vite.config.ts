import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { getManifest, type TargetBrowser } from "./manifest.config.ts";

export default defineConfig(({ mode, command }) => {
  const target: TargetBrowser =
    process.env.TARGET_BROWSER === "firefox" ? "firefox" : "chrome";

  const isScan =
    mode === "scan" ||
    process.env.VITE_REACT_SCAN === "true" ||
    (command === "serve" && mode === "development");

  const manifestPlugin = (targetBrowser: TargetBrowser): Plugin => ({
    name: "vite-plugin-extension-manifest",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(getManifest(targetBrowser), null, 4) + "\n",
      });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/manifest.json") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(getManifest(targetBrowser), null, 4));
          return;
        }
        next();
      });
    },
  });

  return {
    plugins: [react(), tailwindcss(), manifestPlugin(target)],
    define: {
      "import.meta.env.VITE_TARGET_BROWSER": JSON.stringify(target),
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        ...(!isScan
          ? {
              "react-scan": fileURLToPath(
                new URL("./src/utils/react-scan-shim.ts", import.meta.url)
              ),
            }
          : {}),
      },
    },
    build: {
      outDir: process.env.OUT_DIR || `dist/${target}`,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          newtab: "index.html",
          background: "src/background.ts",
        },
        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === "background") return "background.js";
            return "assets/[name].js";
          },
        },
      },
    },
  };
});