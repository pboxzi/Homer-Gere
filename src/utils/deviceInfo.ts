export interface DeviceInfo {
  device_type: string;
  browser: string;
  operating_system: string;
  preferred_language: string;
  user_agent: string;
  screen_resolution: string;
  timezone: string;
  referrer_source: string;
  city_detected: string | null;
  country_detected: string | null;
}

function parseBrowser(ua: string): string {
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/')) return 'Opera';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  return 'Unknown';
}

function parseOS(ua: string): string {
  if (ua.includes('Windows NT 10.')) return 'Windows 10/11';
  if (ua.includes('Windows NT 6.')) return 'Windows 7/8';
  if (ua.includes('Mac OS X')) {
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    return match ? `macOS ${match[1].replace('_', '.')}` : 'macOS';
  }
  if (ua.includes('Android')) {
    const match = ua.match(/Android (\d+[\.\d]*)/);
    return match ? `Android ${match[1]}` : 'Android';
  }
  if (ua.includes('iPhone') || ua.includes('iPad')) {
    const match = ua.match(/OS (\d+[_\d]*)/);
    return match ? `iOS ${match[1].replace('_', '.')}` : 'iOS';
  }
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
}

function parseDevice(ua: string): string {
  if (ua.includes('iPhone')) return 'Mobile (iPhone)';
  if (ua.includes('Android') && ua.includes('Mobile')) return 'Mobile (Android)';
  if (ua.includes('iPad') || ua.includes('Tablet')) return 'Tablet';
  if (ua.includes('Windows') || ua.includes('Mac OS X') || ua.includes('Linux')) return 'Desktop';
  return 'Unknown';
}

function parseReferrerSource(referrer: string): string {
  if (!referrer) return 'Direct visit';
  const lower = referrer.toLowerCase();
  if (lower.includes('google')) return 'Google Search';
  if (lower.includes('facebook') || lower.includes('fb.')) return 'Facebook';
  if (lower.includes('instagram')) return 'Instagram';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'Twitter/X';
  if (lower.includes('tiktok')) return 'TikTok';
  if (lower.includes('youtube')) return 'YouTube';
  if (lower.includes('linkedin')) return 'LinkedIn';
  if (lower.includes('pinterest')) return 'Pinterest';
  if (lower.includes('reddit')) return 'Reddit';
  if (lower.includes('bing')) return 'Bing Search';
  if (lower.includes('yahoo')) return 'Yahoo Search';
  try { return `Referral (${new URL(referrer).hostname})`; } catch { return 'Referral'; }
}

export function detectDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;

  return {
    device_type: parseDevice(ua),
    browser: parseBrowser(ua),
    operating_system: parseOS(ua),
    preferred_language: navigator.language || 'en',
    user_agent: ua,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer_source: parseReferrerSource(document.referrer),
    city_detected: null,
    country_detected: null,
  };
}

export async function detectCountryFromIP(): Promise<{ country: string | null; city: string | null }> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { country: null, city: null };
    const data = await res.json();
    return { country: data.country_name || null, city: data.city || null };
  } catch {
    return { country: null, city: null };
  }
}
