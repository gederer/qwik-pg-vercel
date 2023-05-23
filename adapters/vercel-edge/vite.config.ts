import { vercelEdgeAdapter } from '@builder.io/qwik-city/adapters/vercel-edge/vite';
import { extendConfig } from '@builder.io/qwik-city/vite';
import baseConfig from '../../vite.config';

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.vercel-edge.tsx', '@qwik-city-plan'],
      },
      outDir: '.vercel/output/functions/_qwik-city.func',
    },
    plugins: [vercelEdgeAdapter(), {
      name: 'qwik-city:vercel-edge-fixes',
      enforce: "post",
      config(config) {
        config.ssr = {
          ...config.ssr,
          // vercel-edge uses `target: webworker`, this makes process.env not
          // available. We need to set it to node to make it work.
          // we also support a subset of Node.js API in production so people can use
          // global Buffer or `import { Buffer } from 'buffer'` so it kinda makes sense
          // to set it to node.
          target: "node"
        };
        config.resolve = {
          ...config.resolve,
          // this is a better condition list based on https://github.com/vercel/next.js/blob/2fc0160a2628be40794dc097814006342298583c/packages/next/src/build/webpack-config.ts#L103-L109
          conditions: [
            'edge-light', // the standard wintercg key for Vercel Edge Functions
            'worker',
            'browser',
            'module',
            'main',
          ]
        }
      }
    }],
  };
});
