import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // En Astro v5, "static" es el default y reemplaza a "hybrid"
  // Puedes incluso borrar esta línea, pero la dejo explícita:
  output: "static",

  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});
