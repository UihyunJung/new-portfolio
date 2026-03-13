import path from 'path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'app/assets/styles')],
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default withNextIntl(nextConfig);
