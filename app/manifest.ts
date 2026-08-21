import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WhyUndefeated — The AI Threat & Moat Index',
    short_name: 'WhyUndefeated',
    description: 'Evidence-based threat tracker and community alternatives directory.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0f',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
