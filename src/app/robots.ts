import type { MetadataRoute } from 'next'

const baseUrl = 'https://www.bistro-bert.be'

const disallowPaths = [
  '/api/',
  '/_next/',
  '/admin/',
  '/animations',
  '/gallery-debug',
  '/micro-interactions-test',
  '/modal-dropdown-test',
  '/staggered-animations-test',
  '/transitions-test',
  '/debug-images',
  '/test-error',
  '/test-smart-truncate',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}

