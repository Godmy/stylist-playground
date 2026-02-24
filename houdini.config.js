/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const backendEndpoint = (
  process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL.replace(/\/$/, '')}/graphql/`
    : process.env.VITE_GRAPHQL_ENDPOINT || 'http://127.0.0.1:8000/graphql/'
);

const config = {
  watchSchema: {
    url: backendEndpoint
  },
  runtimeDir: '.houdini',
  plugins: {
    'houdini-svelte': {}
  },
  scalars: {},
  defaultCachePolicy: 'CacheAndNetwork',
  defaultPartial: true,
  defaultKeys: ['id']
};

export default config;
