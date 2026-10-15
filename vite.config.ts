import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

export default defineConfig(({ mode, command }) => {
  const isScan =
    mode === "scan" ||
    process.env.VITE_REACT_SCAN === "true" ||
    (command === "serve" && mode === "development");

  return {
    plugins: [react(), tailwindcss()],
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
      outDir: "dist",
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