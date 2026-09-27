export async function getCuteUrl() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  
  try {
    // Using Unsplash's free API to fetch random cute animal photos
    const unsplashUrl = 'https://api.unsplash.com/photos/random?query=cute+animals&client_id=' + UNSPLASH_ACCESS_KEY;
    
    const response = await fetch(unsplashUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'justinbeckwith:awwbot:v1.0.0 (by /u/justinblat)',
      },
      // Add these to speed up the request:
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
    
    // Unsplash returns a single photo object with a urls.regular property
    if (data.urls?.regular) {
      return data.urls.regular;
    }
    throw new Error('No valid image found');
  } finally {
    clearTimeout(timeout);
  }
}
