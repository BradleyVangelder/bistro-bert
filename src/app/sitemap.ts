import type { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

const baseUrl = 'https://www.bistro-bert.be'

type RouteConfig = {
  path: string
  file: string
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']
  priority: number
  images?: string[]
}

const routes: RouteConfig[] = [
  {
    path: '/',
    file: 'src/app/page.tsx',
    changeFrequency: 'weekly',
    priority: 1,
    images: ['https://www.bistro-bert.be/images/restaurant/hero-moody-wine-bar.jpg'],
  },
  {
    path: '/menu',
    file: 'src/app/menu/page.tsx',
    changeFrequency: 'weekly',
    priority: 0.9,
    images: ['https://www.bistro-bert.be/images/restaurant/cuisine.jpg'],
  },
  {
    path: '/contact',
    file: 'src/app/contact/page.tsx',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    path: '/over-ons',
    file: 'src/app/over-ons/page.tsx',
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    path: '/faq',
    file: 'src/app/faq/page.tsx',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
]

async function getLastModified(file: string): Promise<string> {
  try {
    const stats = await fs.stat(path.join(process.cwd(), file))
    return stats.mtime.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return Promise.all(
    routes.map(async ({ path: routePath, file, changeFrequency, priority, images }) => ({
      url: `${baseUrl}${routePath}`,
      lastModified: await getLastModified(file),
      changeFrequency,
      priority,
      images,
    })),
  )
}
