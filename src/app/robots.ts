import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://insurus.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/properties',
          '/tasks',
          '/rewards',
          '/profile',
          '/checklists',
          '/blog/', // Exclude blog from search engines
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}


