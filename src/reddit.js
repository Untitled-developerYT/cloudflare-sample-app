export async function getCuteUrl() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  
  try {
    const response = await fetch(redditUrl, {
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
    // Filter and return immediately without intermediate array operations
    for (const post of data.data.children) {
      if (!post.is_gallery) {
        const url = post.data?.media?.reddit_video?.fallback_url ||
                   post.data?.secure_media?.reddit_video?.fallback_url ||
                   post.data?.url;
        if (url) return url; // Return first valid URL instead of collecting all
      }
    }
    throw new Error('No valid posts found');
  } finally {
    clearTimeout(timeout);
  }
}
