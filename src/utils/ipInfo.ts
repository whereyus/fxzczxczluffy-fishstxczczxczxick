'use client';

export interface IPInfo {
  ip: string;
  country: string;
  city: string;
  isp: string;
  org: string;
  asn: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
}

export async function getIPInfo(): Promise<IPInfo> {
  try {
    const response = await fetch('https://ipwho.is/');
    const data = await response.json();

    return {
      ip: data.ip,
      country: data.country,
      city: data.city,
      isp: data.connection.isp,
      org: data.connection.org || 'Not Available',
      asn: `AS${data.connection.asn}`,
      coordinates: {
        latitude: data.latitude,
        longitude: data.longitude
      },
      timezone: data.timezone.id
    };
  } catch (error) {
    console.error('Error fetching IP info:', error);

    // Fallback data in case of error
    return {
      ip: '185.253.121.51',
      country: 'Turkey',
      city: 'Istanbul',
      isp: 'M Europe SRL',
      org: 'TR1 Net',
      asn: 'AS9009',
      coordinates: {
        latitude: 41.0082376,
        longitude: 28.9783589
      },
      timezone: 'Europe/Istanbul'
    };
  }
}
