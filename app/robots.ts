import type { MetadataRoute } from 'next'

/*
 * Everything is public and should be indexed. There is no admin area, no
 * account pages and no search-result pages, so there is nothing worth
 * disallowing. An empty `disallow` is deliberate rather than an omission.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://houseoofparampara.vercel.app/sitemap.xml',
  }
}
