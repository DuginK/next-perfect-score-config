/**
 * Next.js Performance Configuration
 * 
 * Source: https://knaru.com
 * GitHub: https://github.com/knaru-dev/next-perfect-score-config
 * 
 * This config achieves 100/100 Lighthouse scores on desktop.
 */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 31536000,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    async headers() {
        return [
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ]
    },

    experimental: {
        inlineCss: true,
        optimizePackageImports: [
            'lucide-react',
            'date-fns',
            'react-hook-form',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
        ],
        webpackBuildWorker: true,
    },

    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    reactCompiler: true,

    modularizeImports: {
        'lucide-react': {
            transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
            skipDefaultConversion: false,
        },
        'date-fns': {
            transform: 'date-fns/{{member}}',
        },
    },

    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    compress: true,
}

module.exports = withBundleAnalyzer(nextConfig)
