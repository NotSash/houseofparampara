/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * Type errors fail the build, deliberately.
   *
   * This was `ignoreBuildErrors: true`. On a site that calculates prices and
   * composes them into a WhatsApp message, a type error is not a developer
   * inconvenience: it is a wrong number sent to a customer. The build is the
   * only thing standing between a mistake and a real order.
   */
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    /*
     * Image optimisation ON.
     *
     * This was `unoptimized: true`, which switched off WebP conversion and
     * per-device resizing entirely. Measured consequence: all 39 source images
     * are 1024x1024 PNGs totalling 57.8 MB, and 3,131 KB of that loaded before
     * a single word of the page was readable.
     *
     * This audience arrives from Instagram on Indian mobile data. Three
     * megabytes is roughly ten to twenty seconds of blank screen on a slow
     * connection, and most people leave before it resolves.
     *
     * Every image already uses `next/image` with a `sizes` prop, so turning
     * this on is enough for Next to serve a correctly sized modern format.
     * Nothing about the design changes.
     */
    formats: ['image/avif', 'image/webp'],

    /*
     * Cache optimised images for a year. They are content-hashed by filename,
     * so a changed image gets a new URL and this can safely be long.
     */
    minimumCacheTTL: 31536000,
  },
}

export default nextConfig
