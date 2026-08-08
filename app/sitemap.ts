import type { MetadataRoute } from 'next'

/*
 * The site is currently a single page with anchor links, so the sitemap has
 * exactly one entry. That is not an oversight: listing `/#collections` as a
 * separate URL would be dishonest, because it is the same document and search
 * engines treat it as such.
 *
 * When each collection gets its own route (Phase 5), they belong here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://houseoofparampara.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
