/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  distDir: 'build',
  output: 'export',



  assetPrefix: process.env.SELF_PATH,
  publicRuntimeConfig: {
    SELF_PATH: process.env.SELF_PATH,
    /* */
  }
};

export default config;
