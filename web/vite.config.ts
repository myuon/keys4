import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/keys4/",
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
});
