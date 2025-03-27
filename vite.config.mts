import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default function ({ mode }) {
  const env = loadEnv(mode, "");

  return defineConfig({
    build: {
      sourcemap: true, // Source map generation must be turned on
    },
    plugins: [
      tsconfigPaths(),
      react(),
      tailwindcss(),
      sentryVitePlugin({
        org: "example-org",
        project: "example-project",
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        telemetry: false,
      }),
    ],
  });
}
