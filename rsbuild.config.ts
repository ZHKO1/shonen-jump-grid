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
  server: {
    proxy: {
      '/proxy': {
        target: import.meta.env.PUBLIC_API_UPLOAD,
        changeOrigin: true,
        pathRewrite: { '^/proxy': '' },
        onProxyRes: (proxyRes) => {
          proxyRes.headers['Cache-Control'] = 'public, max-age=3600';
        },
      },
    },
  },
});
