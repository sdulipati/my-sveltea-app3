import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import autoprefixer from "autoprefixer";
import postCssImport from "postcss-import";
import { sveltePreprocess } from "svelte-preprocess";

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
        runes: true,
      },
      preprocess: [
        sveltePreprocess({
          postcss: {
            plugins: [
              postCssImport({
                path: 'src/lib/style',
              }),
              autoprefixer(),
            ],
          },
        }),
      ],
      emitCss: true,
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postCssImport({
          path: 'src/lib/style',
        }),
        autoprefixer(),
      ],
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
    },
  },
  build: {
    lib: {
      entry: {
        button: 'src/lib/components/button/Button.svelte',
        combobox: 'src/lib/components/comboBox/ComboBox.svelte',
        input: 'src/lib/components/input/Input.svelte',
        colors: 'src/lib/style/colors.css',
        typography: 'src/lib/style/typography.css',
        popover: 'src/lib/components/popover/Popover.svelte',
        command: 'src/lib/components/command/Command.svelte',
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
      external: ['svelte', 'svelte/internal'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
  },
  preview: {
    port: 4173
  }
});