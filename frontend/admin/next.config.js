const { i18n } = require('./next-i18next.config')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const serverApiUrl = process.env.SERVER_API_URL || 'http://localhost:8000'
const siteId = process.env.SITE_ID || '1'
const port = process.env.PORT || '3000'

const nextConfig = {
  i18n,
  env: {
    SERVER_API_URL: serverApiUrl,
    PORT: port,
    PROXY_HOST: process.env.PROXY_HOST || `http://localhost:${port}`,
    ENV: process.env.ENV || '-',
    SITE_ID: siteId,
  },
  async rewrites() {
    return [
      {
        source: '/server/:path*',
        destination: `${serverApiUrl}/:path*`,
      },
    ]
  },
}
module.exports = withBundleAnalyzer(nextConfig)
