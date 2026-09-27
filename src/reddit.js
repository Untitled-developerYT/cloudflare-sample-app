export async function getCuteUrl() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    // No API key required: fetch a random cat image from a public endpoint.
    const catUrl = 'https://shibe.online/api/cats?count=1&urls=true&httpsUrls=true';

    const response = await fetch(catUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
      priority: 'high',
      cache: 'no-cache',
    });

    if (!response.ok) {
      let errorText = `Error fetching ${response.url}: ${response.status} ${response.statusText}`;
      try {
        const error = await response.text();
        if (error) {
          errorText = `${errorText} \n\n ${error}`;
        }
      } catch {
        // ignore
      }
      throw new Error(errorText);
    }

    const data = await response.json();
    const imageUrl = Array.isArray(data) ? data[0] : data?.[0];

    if (imageUrl) {
      return imageUrl;
    }

    throw new Error('No valid cat image found');
  } finally {
    clearTimeout(timeout);
  }
}
