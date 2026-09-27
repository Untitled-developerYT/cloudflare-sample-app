export const redditUrl = 'https://shibe.online/api/cats?count=1&urls=true&httpsUrls=true';

export async function getCuteUrl() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(redditUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      priority: 'high',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`Error fetching cat image: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = Array.isArray(data) ? data[0] : data?.[0];

    if (!imageUrl) {
      throw new Error('No valid image found');
    }

    return imageUrl;
  } finally {
    clearTimeout(timeout);
  }
}
