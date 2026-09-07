import type { MetadataRoute } from 'next'
import { BASE_URL } from './lib/site'

const DISALLOW = ['/api/', '/login', '/signup', '/admin', '/dashboard', '/checkout', '/expert']

export default function robots(): MetadataRoute.Robots {
  // /_next/ is intentionally NOT blocked so non-Google crawlers (Bing, AI
  // assistants) can render the calculators and interactive content.
  const aiCrawlers = [
    'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'PerplexityBot', 'Perplexity-User',
    'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'Google-Extended', 'Applebot-Extended', 'CCBot',
  ]
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: 'Googlebot', allow: '/', disallow: DISALLOW },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
