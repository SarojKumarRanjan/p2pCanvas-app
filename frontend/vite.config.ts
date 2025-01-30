import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
 
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});