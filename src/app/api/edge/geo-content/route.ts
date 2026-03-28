/**
 * Edge Function: Geo-Based Content Delivery
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Serve localized content based on user's geolocation
 * Cache: 1 hour with stale-while-revalidate
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Content configuration by country
 */
interface LocalizedContent {
  currency: string;
  language: string;
  dateFormat: string;
  pricingMultiplier: number;
  message: string;
}

const contentConfig: Record<string, LocalizedContent> = {
  US: {
    currency: 'USD',
    language: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    pricingMultiplier: 1.0,
    message: 'Welcome! Check out our resources for mindful leadership and remote work.',
  },
  GB: {
    currency: 'GBP',
    language: 'en-GB',
    dateFormat: 'DD/MM/YYYY',
    pricingMultiplier: 0.79,
    message: 'Welcome! Explore our mindful leadership and remote work resources.',
  },
  DE: {
    currency: 'EUR',
    language: 'de-DE',
    dateFormat: 'DD.MM.YYYY',
    pricingMultiplier: 0.92,
    message: 'Willkommen! Entdecken Sie unsere Ressourcen für achtsame Führung und Remote-Arbeit.',
  },
  FR: {
    currency: 'EUR',
    language: 'fr-FR',
    dateFormat: 'DD/MM/YYYY',
    pricingMultiplier: 0.92,
    message: 'Bienvenue! Découvrez nos ressources sur un leadership conscient et le travail à distance.',
  },
  CA: {
    currency: 'CAD',
    language: 'en-CA',
    dateFormat: 'YYYY-MM-DD',
    pricingMultiplier: 1.36,
    message: 'Welcome! Explore our mindful leadership and remote work resources.',
  },
  AU: {
    currency: 'AUD',
    language: 'en-AU',
    dateFormat: 'DD/MM/YYYY',
    pricingMultiplier: 1.53,
    message: 'G\'day! Check out our resources for mindful leadership and remote work.',
  },
};

/**
 * GET handler - Returns localized content based on geolocation
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get geolocation from headers (Vercel Edge provides these)
    const country = request.headers.get('x-vercel-ip-country') || 'US';
    const city = request.headers.get('x-vercel-ip-city') || 'Unknown';
    const region = request.headers.get('x-vercel-ip-region') || 'Unknown';

    // Get localized content
    const config = contentConfig[country] || contentConfig.US;

    // Build response with geo context
    const data = {
      country,
      city,
      region,
      ...config,
      availableCountries: Object.keys(contentConfig),
      timestamp: new Date().toISOString(),
    };

    // Create response with caching headers
    const response = NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // 1 hour cache, 24 hour SWR
        'Content-Language': config.language,
        'Vary': 'Accept-Language, CloudFront-Viewer-Country',
        'X-Edge-Location': region,
        'X-Edge-Country': country,
      },
    });

    return response;
  } catch (error) {
    console.error('[GeoContent] Error:', error);

    const country = request.headers.get('x-vercel-ip-country') || 'US';
    return NextResponse.json(
      {
        error: 'Failed to load localized content',
        country,
      },
      { status: 500 }
    );
  }
}
