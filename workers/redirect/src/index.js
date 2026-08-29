/**
 * mtlcigarclub.ca -> montrealcigarclub.ca permanent redirect.
 * Preserves path and query string; strips "www."; 301 is cacheable by browsers.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonical = new URL(env.CANONICAL_ORIGIN || 'https://montrealcigarclub.ca');
    url.protocol = 'https:';
    url.hostname = canonical.hostname;
    url.port = '';
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        'Cache-Control': 'public, max-age=86400',
        'X-Robots-Tag': 'noindex',
      },
    });
  },
};
