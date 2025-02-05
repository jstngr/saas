import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";

  return {
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          ref: true,
          svgo: true,
          titleProp: true,
        },
        include: "**/*.svg",
      }),
    ],
    build: {
      target: "esnext",
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("@tabler/icons-react")) {
              // Create a separate chunk for each icon
              const match = id.match(/@tabler\/icons-react\/.*\/(.+?)$/);
              if (match) {
                return `icons/${match[1]}`;
              }
              return "icons-core";
            }
            if (id.includes("@mantine/")) {
              return "mantine";
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@mantine/core",
        "@mantine/hooks",
        "@mantine/form",
        "@mantine/notifications",
      ],
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: {
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    },
  };
});
