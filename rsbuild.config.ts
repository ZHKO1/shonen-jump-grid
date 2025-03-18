import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    title: '週刊少年ジャンプ',
    favicon: './public/icon.jpg',
  },
  resolve: {
    alias: {
      '@': '.',
    },
  },
  plugins: [pluginReact()],
});
